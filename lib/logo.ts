import fs from "node:fs";
import path from "node:path";

/**
 * Le logo Slaega.
 *
 * La marque est bicolore : un « S » sombre et un « L » orange. L'orange tient
 * sur n'importe quel fond, le sombre disparaît sur le thème sombre. D'où deux
 * fichiers plutôt qu'un :
 *
 *   public/slaega-mark.png             — la marque d'origine, pour fond clair
 *   public/slaega-mark-sur-sombre.png  — le sombre remplacé par la couleur du
 *                                        texte, pour fond sombre
 *
 * La variante se régénère avec `npm run logo` après tout changement du fichier
 * d'origine. Elle est facultative : sans elle, la marque d'origine sert dans
 * les deux thèmes.
 */
const FICHIER = "slaega-mark.png";
const FICHIER_SUR_SOMBRE = "slaega-mark-sur-sombre.png";

export interface Logo {
  /** Pour fond clair — et pour tout, si aucune variante n'existe. */
  src: string;
  /** Pour fond sombre, null si la variante n'a pas été générée. */
  srcSurSombre: string | null;
  largeur: number;
  hauteur: number;
}

/** Largeur et hauteur d'un PNG, lues dans son en-tête IHDR. */
function dimensionsPng(donnees: Buffer): { largeur: number; hauteur: number } | null {
  const SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (donnees.length < 24 || !donnees.subarray(0, 8).equals(SIGNATURE)) return null;
  if (donnees.subarray(12, 16).toString("latin1") !== "IHDR") return null;
  return { largeur: donnees.readUInt32BE(16), hauteur: donnees.readUInt32BE(20) };
}

export function getLogo(): Logo | null {
  const chemin = path.join(process.cwd(), "public", FICHIER);
  if (!fs.existsSync(chemin)) return null;

  const dim = dimensionsPng(fs.readFileSync(chemin));
  if (!dim) {
    throw new Error(
      `public/${FICHIER} n'est pas un PNG lisible. Remplace-le par un vrai PNG, ` +
        `ou retire-le pour revenir au logotype typographique.`,
    );
  }

  const variante = path.join(process.cwd(), "public", FICHIER_SUR_SOMBRE);

  return {
    src: `/${FICHIER}`,
    srcSurSombre: fs.existsSync(variante) ? `/${FICHIER_SUR_SOMBRE}` : null,
    largeur: dim.largeur,
    hauteur: dim.hauteur,
  };
}
