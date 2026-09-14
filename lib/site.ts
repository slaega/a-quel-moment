export const site = {
  nom: "À quel moment",
  auteur: "Slaega",
  editeurUrl: "https://slaega.com",
  // Domaine de production. Il sert de base aux URLs absolues des balises
  // Open Graph, du canonical et du sitemap : une valeur erronée ne casse pas
  // le site, elle casse silencieusement tous les aperçus au partage.
  url: "https://a-quel-moment.slaega.com",
  description:
    "Une série de textes courts qui partent d'un fait réel et posent toujours la même question : à quel moment avons-nous trouvé ça normal ?",
  signature: "À quel moment avons-nous trouvé ça normal ?",
} as const;

export const nav = [
  { href: "/cas/", label: "Les CAS" },
  { href: "/philosophie/", label: "Philosophie" },
  { href: "/a-propos/", label: "À propos" },
] as const;
