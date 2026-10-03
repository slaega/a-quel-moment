export const site = {
  nom: "À quel moment",
  auteur: "Slaega",
  editeurUrl: "https://slaega.com",
  // Domaine de production. Il sert de base aux URLs absolues des balises
  // Open Graph, du canonical et du sitemap : une valeur erronée ne casse pas
  // le site, elle casse silencieusement tous les aperçus au partage.
  url: "https://a-quel-moment.slaega.com",
  description:
    "Une série de textes courts qui partent d'un fait réel et se ferment sur une question : à quel moment avons-nous trouvé ça normal ?",
  /*
   * La question de la série, celle qui lui donne son nom.
   *
   * Les textes, eux, en emploient deux formes — onze au passé, huit au futur
   * (« allons-nous encore ») — et chaque CAS porte la sienne, détectée dans
   * son fichier (voir lib/cas.ts). Ce jeton ne sert donc qu'aux pages qui
   * parlent de la série entière, où aucune question particulière ne s'impose.
   */
  signature: "À quel moment avons-nous trouvé ça normal ?",
} as const;

export const nav = [
  { href: "/cas/", label: "Les CAS" },
  { href: "/philosophie/", label: "Philosophie" },
  { href: "/a-propos/", label: "À propos" },
] as const;
