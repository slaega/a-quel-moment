import { execFileSync } from "node:child_process";

/**
 * Date de dernière modification réelle des pages, prise dans l'historique git.
 *
 * Pourquoi ne pas se contenter de la date de publication du CAS : le
 * « lastmod » d'un sitemap annonce la dernière fois que *la page* a changé,
 * pas la date de l'événement qu'elle raconte. Or chaque page est régénérée
 * quand le gabarit bouge — le bouton partager, la largeur de la colonne, le
 * pied de page qui reprend la question ont tous réécrit le HTML des CAS de
 * 2026-08. Annoncer « modifié le 1er septembre » une page dont le contenu a
 * changé le 21 apprend à Google que nos dates sont fausses ; il cesse alors
 * de les lire sur *tout* le sitemap. La date éditoriale, elle, reste à sa
 * place : dans <time>, dans article:published_time et dans datePublished.
 *
 * Tout échec est silencieux et renvoie null : un build ne doit pas tomber
 * parce que git manque ou que le clone est trop court (Vercel clone peu
 * profond — `git log` peut alors ne rien trouver). L'appelant retombe dans
 * ce cas sur la date de publication.
 */
function dernierCommit(...chemins: string[]): string | null {
  try {
    const sortie = execFileSync(
      "git",
      ["log", "-1", "--format=%cI", "--", ...chemins],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
    ).trim();
    return sortie === "" ? null : sortie;
  } catch {
    return null;
  }
}

let gabarit: string | null | undefined;

/**
 * Dernière fois que le rendu lui-même a changé. Toutes les pages exportées
 * en dépendent, puisqu'elles sont toutes reconstruites à partir de ces
 * fichiers.
 */
export function revisionDuGabarit(): string | null {
  if (gabarit === undefined) {
    gabarit = dernierCommit("app", "components", "lib");
  }
  return gabarit;
}

/** Dernière modification d'un fichier de contenu. */
export function revisionDuFichier(chemin: string): string | null {
  return dernierCommit(chemin);
}

/** La plus récente des dates fournies, les absentes étant ignorées. */
export function laPlusRecente(...dates: (string | null | undefined)[]): string | null {
  const connues = dates
    .filter((d): d is string => typeof d === "string" && d !== "")
    .map((d) => ({ brut: d, temps: Date.parse(d) }))
    .filter((d) => Number.isFinite(d.temps));

  if (connues.length === 0) return null;
  return connues.reduce((a, b) => (b.temps > a.temps ? b : a)).brut;
}
