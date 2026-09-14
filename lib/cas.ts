import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

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
  /** true tant que le texte publié n'a pas remplacé le brouillon. */
  brouillon: boolean;
  /** Corps du texte en HTML, signature finale retirée. */
  corps: string;
  /** Question de clôture, isolée pour être composée en serif italique. */
  signature: string | null;
  /** Texte intégral en clair, pour le bouton « copier ». */
  texteBrut: string;
}

const DOSSIER = path.join(process.cwd(), "content", "cas");

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

function enHtml(markdown: string): string {
  return String(
    unified()
      .use(remarkParse)
      .use(remarkGfm)
      // Les retours à la ligne sont voulus : ces textes sont écrits en lignes,
      // pas en paragraphes coulants.
      .use(remarkBreaks)
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
    brouillon: data.brouillon === true,
    corps: enHtml(texte),
    signature,
    texteBrut: content.trim(),
  };
}

let cache: Cas[] | null = null;

/** Tous les CAS, du plus récent au plus ancien. */
export function getTousLesCas(): Cas[] {
  if (cache) return cache;

  const fichiers = fs
    .readdirSync(DOSSIER)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"));

  const cas = fichiers.map(lireFichier).sort((a, b) => b.numero - a.numero);

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
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}
