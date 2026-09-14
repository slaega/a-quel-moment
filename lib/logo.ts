import fs from "node:fs";
import path from "node:path";

/**
 * Le logo Slaega, s'il a été déposé.
 *
 * Poser le fichier dans public/slaega-mark.png suffit : l'en-tête, le pied de
 * page et les affiches de partage le reprennent automatiquement. En son
 * absence, le site retombe sur le logotype typographique de
 * components/LogoSlaega.tsx.
 */
export const FICHIER_LOGO = "slaega-mark.png";

/**
 * Passer à true si la marque est monochrome sur fond transparent : elle est
 * alors teintée par CSS et suit le thème clair ou sombre. À laisser sur false
 * pour un logo en couleurs, qu'un masque détruirait.
 */
export const LOGO_MONOCHROME = false;

export interface Logo {
  src: string;
  largeur: number;
  hauteur: number;
  monochrome: boolean;
}

/** Largeur et hauteur d'un PNG, lues dans son en-tête IHDR. */
function dimensionsPng(donnees: Buffer): { largeur: number; hauteur: number } | null {
  const SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (donnees.length < 24 || !donnees.subarray(0, 8).equals(SIGNATURE)) return null;
  if (donnees.subarray(12, 16).toString("latin1") !== "IHDR") return null;
  return {
    largeur: donnees.readUInt32BE(16),
    hauteur: donnees.readUInt32BE(20),
  };
}

export function getLogo(): Logo | null {
  const chemin = path.join(process.cwd(), "public", FICHIER_LOGO);
  if (!fs.existsSync(chemin)) return null;

  const dim = dimensionsPng(fs.readFileSync(chemin));
  if (!dim) {
    throw new Error(
      `public/${FICHIER_LOGO} n'est pas un PNG lisible. Remplace-le par un vrai PNG, ` +
        `ou retire-le pour revenir au logotype typographique.`,
    );
  }

  return {
    src: `/${FICHIER_LOGO}`,
    largeur: dim.largeur,
    hauteur: dim.hauteur,
    monochrome: LOGO_MONOCHROME,
  };
}
