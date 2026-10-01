import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { remarkRenvois, type OptionsRenvois } from "@/lib/renvois";
import { laPlusRecente, revisionDuFichier, revisionDuGabarit } from "@/lib/revision";

/** Une référence vérifiable, affichée sous la question de clôture. */
export interface Source {
  /** Libellé lisible. À défaut, le domaine. */
  titre: string;
  url: string;
}

export interface Cas {
  /** Numéro de publication, tel qu'il apparaît dans la série. */
  numero: number;
  /** Numéro sur 3 chiffres — sert de segment d'URL : /cas/014/ */
  slug: string;
  /**
   * Titre affiché. Ces textes sont des statuts : la plupart n'en ont pas.
   * À défaut de frontmatter « titre », c'est la première ligne du texte.
   */
  titre: string;
  /** Date ISO (YYYY-MM-DD), ou null pour un CAS non daté. */
  date: string | null;
  categorie: string | null;
  /** Phrase mise en avant dans l'archive et au partage. */
  extrait: string | null;
  /**
   * L'extrait, mais seulement quand il n'est pas déjà dans le texte.
   *
   * La plupart des extraits sont une phrase reprise du corps : l'afficher en
   * chapô la ferait lire deux fois à trois lignes d'intervalle. Quand il est
   * en revanche une vraie introduction, écrite pour résumer, il mérite sa
   * place en tête d'article.
   */
  chapo: string | null;
  /** Origine du texte quand il ne vient pas de l'auteur seul. */
  contribution: string | null;
  /** true tant que le texte publié n'a pas remplacé le brouillon. */
  brouillon: boolean;
  /** Corps du texte en HTML, signature finale retirée. */
  corps: string;
  /** Question de clôture, isolée pour être composée en serif italique. */
  signature: string | null;
  /** Texte intégral en clair, pour le bouton « copier ». */
  texteBrut: string;
  /**
   * Références du texte. Un CAS part d'un fait réel : quand ce fait est
   * chiffré, le lecteur doit pouvoir remonter à la source sans quitter la
   * page pour une recherche. Vide quand le texte est un témoignage.
   */
  sources: Source[];
  /**
   * Dernière modification réelle de la page, pour le sitemap et dateModified.
   * Distincte de `date`, qui est la date de parution du texte. null quand on
   * ne peut pas l'établir : mieux vaut aucune date qu'une date inventée, que
   * chaque build changerait.
   */
  revision: string | null;
}

const DOSSIER = path.join(process.cwd(), "content", "cas");

function fichiersCas(): string[] {
  return fs.readdirSync(DOSSIER).filter((f) => f.endsWith(".md") && !f.startsWith("_"));
}

let publies: Set<number> | null = null;

/**
 * Les numéros qui ont une page. Les renvois d'un CAS à un autre s'y réfèrent,
 * et ils sont lus avant que les CAS eux-mêmes soient construits — d'où cette
 * passe séparée, qui ne lit que le frontmatter.
 *
 * Elle évite de produire un lien vers un CAS qui n'existe pas : les 011 et
 * 012 sont déclarés sans suite, un renvoi vers eux mènerait à une 404.
 */
function numerosPublies(): Set<number> {
  if (publies) return publies;
  publies = new Set(
    fichiersCas()
      .map((f) => Number(matter(fs.readFileSync(path.join(DOSSIER, f), "utf8")).data.numero))
      .filter(Number.isInteger),
  );
  return publies;
}

/**
 * La question de clôture. Elle est le plus souvent « à quel moment avons-nous
 * trouvé ça normal ? », mais certains CAS la reformulent : on reconnaît donc
 * toute dernière ligne qui ouvre sur « à quel moment » et se ferme sur un
 * point d'interrogation.
 */
const SIGNATURE = /^à\s+quel\s+moment\b.*\?\s*$/i;

/**
 * Empêche une ligne qui commence par un nombre suivi d'un point de devenir une
 * liste numérotée.
 *
 * Ces textes sont écrits en français ordinaire, pas en Markdown : « 2013. »
 * ouvrant un paragraphe est une date, pas une énumération. Sans ça, le
 * paragraphe part en retrait sous une puce invisible.
 *
 * L'échappement ne sert qu'au rendu. Le texte copié reste intact : il est pris
 * du fichier d'origine, avant cette étape.
 */
function neutraliserListesAccidentelles(markdown: string): string {
  return markdown.replace(/^(\s*)(\d+)([.)])(\s)/gm, "$1$2\\$3$4");
}

function enHtml(markdown: string, renvois: OptionsRenvois): string {
  return String(
    unified()
      .use(remarkParse)
      .use(remarkGfm)
      // Les retours à la ligne sont voulus : ces textes sont écrits en lignes,
      // pas en paragraphes coulants.
      .use(remarkBreaks)
      // Après remarkBreaks, avant la conversion en HTML : les renvois
      // travaillent sur le texte, pas sur des balises.
      .use(() => remarkRenvois(renvois))
      .use(remarkRehype)
      .use(rehypeStringify)
      .processSync(neutraliserListesAccidentelles(markdown)),
  );
}

function separerSignature(corps: string): { texte: string; signature: string | null } {
  const lignes = corps.trimEnd().split("\n");
  for (let i = lignes.length - 1; i >= 0; i -= 1) {
    const ligne = lignes[i].trim();
    if (ligne === "") continue;
    if (!SIGNATURE.test(ligne)) break;
    return {
      texte: lignes.slice(0, i).join("\n").trimEnd(),
      signature: ligne,
    };
  }
  return { texte: corps.trimEnd(), signature: null };
}

function premiereLigne(texte: string): string {
  const ligne = texte
    .split("\n")
    .map((l) => l.trim())
    .find((l) => l !== "" && !l.startsWith("#") && !l.startsWith(">"));
  return ligne ?? "";
}

function chaineOuNull(valeur: unknown): string | null {
  return typeof valeur === "string" && valeur.trim() !== "" ? valeur.trim() : null;
}

/**
 * Lit le frontmatter « sources ». Accepte une URL seule ou un couple
 * titre/url, et refuse une URL invalide : mieux vaut casser le build qu'un
 * lien mort sous un texte qui s'appuie dessus.
 */
function lireSources(valeur: unknown, fichier: string): Source[] {
  if (valeur == null) return [];
  if (!Array.isArray(valeur)) {
    throw new Error(`content/cas/${fichier} : « sources » doit être une liste.`);
  }

  return valeur.map((entree, i) => {
    const place = `content/cas/${fichier} : source ${i + 1}`;
    const brut =
      typeof entree === "string"
        ? { url: entree, titre: null }
        : {
            url: chaineOuNull((entree as Record<string, unknown>)?.url),
            titre: chaineOuNull((entree as Record<string, unknown>)?.titre),
          };

    if (!brut.url) throw new Error(`${place} : « url » manquante.`);

    let lien: URL;
    try {
      lien = new URL(brut.url);
    } catch {
      throw new Error(`${place} : « ${brut.url} » n'est pas une URL.`);
    }
    if (lien.protocol !== "https:" && lien.protocol !== "http:") {
      throw new Error(`${place} : « ${brut.url} » n'est pas un lien web.`);
    }

    return { titre: brut.titre ?? lien.hostname.replace(/^www\./, ""), url: lien.href };
  });
}

/** Compare deux textes en ignorant la ponctuation et les espaces. */
function aplatir(texte: string): string {
  return texte
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function chapoInedit(extrait: string | null, corps: string): string | null {
  if (!extrait) return null;
  return aplatir(corps).includes(aplatir(extrait)) ? null : extrait;
}

function lireFichier(fichier: string): Cas {
  const brut = fs.readFileSync(path.join(DOSSIER, fichier), "utf8");
  const { data, content } = matter(brut);

  const numero = Number(data.numero);
  if (!Number.isInteger(numero)) {
    throw new Error(`content/cas/${fichier} : frontmatter « numero » manquant ou invalide.`);
  }

  const { texte, signature } = separerSignature(content);
  const titre = chaineOuNull(data.titre) ?? premiereLigne(texte);
  if (titre === "") {
    throw new Error(`content/cas/${fichier} : ni titre ni texte, impossible d'afficher ce CAS.`);
  }

  return {
    numero,
    slug: String(numero).padStart(3, "0"),
    titre,
    date: chaineOuNull(data.date),
    categorie: chaineOuNull(data.categorie),
    extrait: chaineOuNull(data.extrait),
    chapo: chapoInedit(chaineOuNull(data.extrait), content),
    contribution: chaineOuNull(data.contribution),
    brouillon: data.brouillon === true,
    corps: enHtml(texte, { existants: numerosPublies(), courant: numero }),
    sources: lireSources(data.sources, fichier),
    signature,
    texteBrut: content.trim(),
    // La page a changé chaque fois que son texte ou le gabarit a bougé.
    // Sans historique git exploitable, on retombe sur la date de publication.
    // La date éditoriale n'entre pas dans ce calcul : elle ne sert que de
    // repli quand git ne dit rien (clone trop court, build hors dépôt).
    revision:
      laPlusRecente(
        revisionDuFichier(path.join(DOSSIER, fichier)),
        revisionDuGabarit(),
      ) ?? chaineOuNull(data.date),
  };
}

let cache: Cas[] | null = null;

/** Tous les CAS, du plus récent au plus ancien. */
export function getTousLesCas(): Cas[] {
  if (cache) return cache;

  const cas = fichiersCas().map(lireFichier).sort((a, b) => b.numero - a.numero);

  const doublon = cas.find((c, i) => i > 0 && cas[i - 1].numero === c.numero);
  if (doublon) {
    throw new Error(`Deux CAS portent le numéro ${doublon.numero}.`);
  }

  cache = cas;
  return cas;
}

export function getCas(slug: string): Cas | undefined {
  return getTousLesCas().find((c) => c.slug === slug);
}

export function getDernierCas(): Cas | undefined {
  return getTousLesCas()[0];
}

/** Catégories présentes dans le corpus, par nombre de CAS décroissant. */
export function getCategories(): { nom: string; total: number }[] {
  const compte = new Map<string, number>();
  for (const c of getTousLesCas()) {
    if (!c.categorie) continue;
    compte.set(c.categorie, (compte.get(c.categorie) ?? 0) + 1);
  }
  return [...compte.entries()]
    .map(([nom, total]) => ({ nom, total }))
    .sort((a, b) => b.total - a.total || a.nom.localeCompare(b.nom, "fr"));
}

/** Voisins dans l'ordre de publication : précédent = numéro inférieur. */
/**
 * Quoi lire ensuite.
 *
 * La même catégorie d'abord — c'est le lien le plus fort entre deux textes —
 * puis les numéros les plus proches pour compléter. Les voisins immédiats
 * sont exclus : ils ont déjà leur place dans la navigation précédent/suivant,
 * et les proposer deux fois sur le même écran ne recommande rien.
 */
export function getRecommandations(slug: string, combien = 2): Cas[] {
  const tous = getTousLesCas();
  const i = tous.findIndex((c) => c.slug === slug);
  if (i === -1) return [];

  const courant = tous[i];
  const dejaMontres = new Set([slug, tous[i - 1]?.slug, tous[i + 1]?.slug]);
  const candidats = tous.filter((c) => !dejaMontres.has(c.slug));

  const memeCategorie = courant.categorie
    ? candidats.filter((c) => c.categorie === courant.categorie)
    : [];

  const parProximite = candidats
    .filter((c) => !memeCategorie.includes(c))
    .sort((a, b) => Math.abs(a.numero - courant.numero) - Math.abs(b.numero - courant.numero));

  return [...memeCategorie, ...parProximite].slice(0, combien);
}

export function getVoisins(slug: string): { precedent: Cas | null; suivant: Cas | null } {
  const cas = getTousLesCas();
  const i = cas.findIndex((c) => c.slug === slug);
  if (i === -1) return { precedent: null, suivant: null };
  return {
    precedent: cas[i + 1] ?? null,
    suivant: cas[i - 1] ?? null,
  };
}

export function formaterDate(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;

  const rendu = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);

  // Intl écrit « 1 septembre » ; le français demande « 1er septembre ».
  return d.getUTCDate() === 1 ? rendu.replace(/^1 /, "1er ") : rendu;
}
