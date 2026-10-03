export const site = {
  nom: "À quel moment",
  auteur: "Slaega",
  editeurUrl: "https://slaega.com",
  // Domaine de production. Il sert de base aux URLs absolues des balises
  // Open Graph, du canonical et du sitemap : une valeur erronée ne casse pas
  // le site, elle casse silencieusement tous les aperçus au partage.
  url: "https://a-quel-moment.slaega.com",
  description:
    "Une série de textes courts qui partent d'un fait réel et se ferment sur une question : à quel moment avons-nous trouvé ça normal ? — ou, de plus en plus : à quel moment allons-nous encore trouver ça normal ?",
  /*
   * Les deux questions de la série.
   *
   * Onze textes posent la première, huit la seconde. Les traiter comme une
   * seule revenait à décrire la série à moitié : l'une regarde ce qu'on a
   * déjà accepté, l'autre ce qu'on s'apprête à accepter encore. Chaque CAS
   * porte la sienne (voir lib/cas.ts) ; les pages qui parlent de la série
   * entière les portent toutes les deux.
   */
  signature: "À quel moment avons-nous trouvé ça normal ?",
  signatureProjetee: "À quel moment allons-nous encore trouver ça normal ?",
} as const;

export const nav = [
  { href: "/cas/", label: "Les CAS" },
  { href: "/philosophie/", label: "Philosophie" },
  { href: "/a-propos/", label: "À propos" },
] as const;
