import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

export interface Cas {
  /** Numéro de publication, tel qu'il apparaît dans la série. */
  numero: number;
  /** Numéro sur 3 chiffres — sert de segment d'URL : /cas/014/ */
  slug: string;
  titre: string;
  /** Date ISO (YYYY-MM-DD) */
  date: string;
  categorie: string;
  extrait: string;
  /** true tant que le texte publié n'a pas remplacé le brouillon. */
  brouillon: boolean;
  /** Corps du texte en HTML, signature finale retirée. */
  corps: string;
  /** Phrase de signature, isolée pour être composée en serif italique. */
  signature: string | null;
  /** Texte intégral en clair, pour le bouton « copier ». */
  texteBrut: string;
}

const DOSSIER = path.join(process.cwd(), "content", "cas");

/**
 * Reconnaît la signature de la série en fin de texte, quelles que soient les
 * variantes d'espacement, de casse ou de ponctuation finale.
 */
const SIGNATURE = /^à\s+quel\s+moment\s+avons[-\s]nous\s+trouvé\s+ça\s+normal\s*[?!.]*$/i;

function enHtml(markdown: string): string {
  return String(
    unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype)
      .use(rehypeStringify)
      .processSync(markdown),
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

function lireFichier(fichier: string): Cas {
  const brut = fs.readFileSync(path.join(DOSSIER, fichier), "utf8");
  const { data, content } = matter(brut);

  const numero = Number(data.numero);
  if (!Number.isInteger(numero)) {
    throw new Error(`content/cas/${fichier} : frontmatter « numero » manquant ou invalide.`);
  }
  for (const champ of ["titre", "date", "categorie", "extrait"] as const) {
    if (typeof data[champ] !== "string" || data[champ].trim() === "") {
      throw new Error(`content/cas/${fichier} : frontmatter « ${champ} » manquant.`);
    }
  }

  const { texte, signature } = separerSignature(content);

  return {
    numero,
    slug: String(numero).padStart(3, "0"),
    titre: data.titre,
    date: data.date,
    categorie: data.categorie,
    extrait: data.extrait,
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

export function formaterDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}
