export const site = {
  nom: "À quel moment",
  auteur: "Slaega",
  // Remplace par le domaine final avant le déploiement : il sert de base
  // aux URLs absolues des balises Open Graph.
  url: "https://a-quel-moment.vercel.app",
  description:
    "Une série de textes courts qui partent d'un fait réel et posent toujours la même question : à quel moment avons-nous trouvé ça normal ?",
  signature: "À quel moment avons-nous trouvé ça normal ?",
} as const;

export const nav = [
  { href: "/cas/", label: "Les CAS" },
  { href: "/philosophie/", label: "Philosophie" },
  { href: "/a-propos/", label: "À propos" },
] as const;
