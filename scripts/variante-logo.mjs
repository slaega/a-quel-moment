/**
 * Dérive la version du logo destinée aux fonds sombres.
 *
 * La marque est faite de deux aplats : un noir (#111111) et un orange
 * (#FF5A00). L'orange tient sur n'importe quel fond, le noir disparaît sur le
 * sombre. On ne remplace donc que le noir, par la couleur du texte du thème
 * sombre, et on laisse l'orange intact.
 *
 * Les pixels d'anticrénelage sont des mélanges des deux teintes. Les traiter au
 * seuil laisserait un liseré noir sur chaque bord : on projette plutôt chaque
 * pixel sur le segment noir→orange pour retrouver sa proportion, puis on
 * recompose avec la nouvelle couleur. La transparence n'est jamais touchée.
 *
 *   node scripts/variante-logo.mjs
 */
import path from "node:path";
import sharp from "sharp";

const RACINE = process.cwd();
const SOURCE = path.join(RACINE, "public", "slaega-mark.png");
const CIBLE = path.join(RACINE, "public", "slaega-mark-sur-sombre.png");

const NOIR = [0x11, 0x11, 0x11];
const ORANGE = [0xff, 0x5a, 0x00];
// --r-encre du thème sombre, dans app/globals.css.
const REMPLACEMENT = [0xf2, 0xf0, 0xec];

const axe = ORANGE.map((v, i) => v - NOIR[i]);
const axeCarre = axe.reduce((s, v) => s + v * v, 0);

const { data, info } = await sharp(SOURCE)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

let repeints = 0;

for (let i = 0; i < data.length; i += 4) {
  if (data[i + 3] === 0) continue;

  // Proportion d'orange dans ce pixel : 0 = noir pur, 1 = orange pur.
  let t = 0;
  for (let c = 0; c < 3; c += 1) t += (data[i + c] - NOIR[c]) * axe[c];
  t = Math.min(1, Math.max(0, t / axeCarre));

  for (let c = 0; c < 3; c += 1) {
    data[i + c] = Math.round(REMPLACEMENT[c] * (1 - t) + ORANGE[c] * t);
  }
  if (t < 0.5) repeints += 1;
}

await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
  .png()
  .toFile(CIBLE);

console.log(
  `Variante fond sombre écrite : public/slaega-mark-sur-sombre.png ` +
    `(${info.width}×${info.height}, ${repeints} pixels repeints)`,
);
