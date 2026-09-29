import type { Cas } from "@/lib/cas";
import { site } from "@/lib/site";

const AUTEUR = {
  "@type": "Person",
  name: site.auteur,
  url: site.editeurUrl,
} as const;

/** Identité du site, rattachée à l'accueil. */
export function schemaSite() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#site`,
    name: site.nom,
    url: `${site.url}/`,
    description: site.description,
    inLanguage: "fr-FR",
    author: AUTEUR,
    publisher: AUTEUR,
  };
}

/** Un CAS : un texte daté, signé, rattaché à la série. */
export function schemaCas(cas: Cas) {
  const url = `${site.url}/cas/${cas.slug}/`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#cas`,
    mainEntityOfPage: url,
    url,
    headline: cas.titre,
    ...(cas.extrait ? { description: cas.extrait } : {}),
    ...(cas.categorie ? { articleSection: cas.categorie } : {}),
    // La date de publication est celle du texte ; dateModified celle de la
    // page. Les confondre est précisément ce qui décrédibilise nos dates.
    ...(cas.date ? { datePublished: cas.date } : {}),
    ...(cas.revision ? { dateModified: cas.revision } : {}),
    inLanguage: "fr-FR",
    author: AUTEUR,
    publisher: AUTEUR,
    image: `${site.url}/og/cas-${cas.slug}.png`,
    isPartOf: { "@id": `${site.url}/cas/#serie` },
  };
}

/** L'archive, et la liste explicite de tous les CAS. */
export function schemaArchive(cas: Cas[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${site.url}/cas/#serie`,
    url: `${site.url}/cas/`,
    name: `Les CAS — ${site.nom}`,
    description: site.description,
    inLanguage: "fr-FR",
    author: AUTEUR,
    publisher: AUTEUR,
    blogPost: cas.map((c) => ({
      "@type": "BlogPosting",
      "@id": `${site.url}/cas/${c.slug}/#cas`,
      url: `${site.url}/cas/${c.slug}/`,
      headline: c.titre,
      ...(c.date ? { datePublished: c.date } : {}),
    })),
  };
}
