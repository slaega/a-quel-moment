/**
 * Génère une affiche PNG par CAS, pour l'aperçu au partage.
 *
 * Tourne avant `next build` (script npm « prebuild ») : l'export statique ne
 * peut pas fabriquer d'image à la volée, les fichiers doivent exister dans
 * public/ au moment du build.
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import matter from "gray-matter";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const require = createRequire(import.meta.url);

const RACINE = process.cwd();
const SOURCE = path.join(RACINE, "content", "cas");
const SORTIE = path.join(RACINE, "public", "og");

const LARGEUR = 1200;
const HAUTEUR = 630;

// Mêmes valeurs que le bloc @theme de app/globals.css.
const ENCRE = "#0B0B0C";
const CRAIE = "#F2F0EC";
const ROUGE = "#C8362B";
const CENDRE = "#86837E";
const ESTOMPE = "#B9B6B1";

/**
 * Le logo Slaega, s'il a été déposé dans public/.
 *
 * Les affiches sont toujours sombres : la marque d'origine, dont le « S » est
 * presque noir, y disparaîtrait. On prend donc la variante pour fond sombre
 * quand elle existe, et on retombe sinon sur le fichier d'origine.
 */
function chargerLogo() {
  const candidats = ["slaega-mark-sur-sombre.png", "slaega-mark.png"];
  const chemin = candidats
    .map((f) => path.join(RACINE, "public", f))
    .find((c) => fs.existsSync(c));
  if (!chemin) return null;

  const donnees = fs.readFileSync(chemin);
  const SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (donnees.length < 24 || !donnees.subarray(0, 8).equals(SIGNATURE)) return null;
  if (donnees.subarray(12, 16).toString("latin1") !== "IHDR") return null;

  return {
    uri: `data:image/png;base64,${donnees.toString("base64")}`,
    largeur: donnees.readUInt32BE(16),
    hauteur: donnees.readUInt32BE(20),
  };
}

const LOGO = chargerLogo();

const polices = [
  {
    name: "Inter",
    weight: 400,
    style: "normal",
    data: fs.readFileSync(require.resolve("@fontsource/inter/files/inter-latin-400-normal.woff")),
  },
  {
    name: "Inter",
    weight: 600,
    style: "normal",
    data: fs.readFileSync(require.resolve("@fontsource/inter/files/inter-latin-600-normal.woff")),
  },
  {
    name: "Lora",
    weight: 400,
    style: "italic",
    data: fs.readFileSync(require.resolve("@fontsource/lora/files/lora-latin-400-italic.woff")),
  },
];

/**
 * Satori accepte l'arbre React sous forme d'objets — pas besoin de JSX.
 * Les entrées nulles sont retirées : satori les prendrait pour des éléments.
 */
function e(type, style, enfants) {
  let children = Array.isArray(enfants) ? enfants.filter(Boolean) : enfants;
  // Un tableau vide compte comme « plusieurs enfants » côté satori, qui exige
  // alors un display explicite : une feuille n'a simplement pas d'enfant.
  if (Array.isArray(children) && children.length === 0) children = undefined;
  return { type, props: { style, children } };
}

function texte(style, contenu) {
  return e("div", style, contenu);
}

/** Un titre long doit rester dans l'affiche : on réduit le corps par paliers. */
function tailleDuTitre(titre) {
  if (titre.length > 90) return 44;
  if (titre.length > 64) return 52;
  if (titre.length > 40) return 62;
  return 74;
}

/** Certains CAS reformulent la question de clôture, parfois longuement. */
function tailleDeLaSignature(signature) {
  if (signature.length > 90) return 25;
  if (signature.length > 60) return 29;
  return 34;
}

const SIGNATURE_MOTIF = /^à\s+quel\s+moment\b.*\?\s*$/i;

/** Même découpage que lib/cas.ts : la question de clôture vit à part. */
function separerSignature(corps) {
  const lignes = corps.trimEnd().split("\n");
  for (let i = lignes.length - 1; i >= 0; i -= 1) {
    const ligne = lignes[i].trim();
    if (ligne === "") continue;
    if (!SIGNATURE_MOTIF.test(ligne)) break;
    return { texte: lignes.slice(0, i).join("\n").trimEnd(), signature: ligne };
  }
  return { texte: corps.trimEnd(), signature: null };
}

function premiereLigne(texte) {
  return (
    texte
      .split("\n")
      .map((l) => l.trim())
      .find((l) => l !== "" && !l.startsWith("#") && !l.startsWith(">")) ?? ""
  );
}

function affiche({ numero, categorie, titre, extrait, signature, marque = true }) {
  return e(
    "div",
    {
      width: "100%",
      height: "100%",
      display: "flex",
      backgroundColor: ENCRE,
      fontFamily: "Inter",
      padding: "72px 80px",
    },
    [
      // La bande rouge, comme sur la page du CAS.
      e("div", { width: 6, backgroundColor: ROUGE, marginRight: 56, flexShrink: 0 }, null),

      e(
        "div",
        { display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 },
        [
          e("div", { display: "flex", flexDirection: "column" }, [
            e("div", { display: "flex", alignItems: "center", marginBottom: 34 }, [
              texte({ fontSize: 30, fontWeight: 600, color: ROUGE, letterSpacing: -0.5 }, numero),
              categorie
                ? texte(
                    {
                      fontSize: 18,
                      color: CENDRE,
                      letterSpacing: 3.4,
                      textTransform: "uppercase",
                      marginLeft: 28,
                    },
                    categorie,
                  )
                : null,
            ]),

            texte(
              {
                fontSize: tailleDuTitre(titre),
                fontWeight: 600,
                color: CRAIE,
                letterSpacing: -2,
                lineHeight: 1.08,
              },
              titre,
            ),

            extrait
              ? texte(
                  { fontSize: 29, color: ESTOMPE, lineHeight: 1.45, marginTop: 30, maxWidth: 940 },
                  extrait,
                )
              : null,
          ]),

          e("div", { display: "flex", alignItems: "flex-end", justifyContent: "space-between" }, [
            texte(
              {
                fontSize: tailleDeLaSignature(signature),
                fontFamily: "Lora",
                fontStyle: "italic",
                color: CRAIE,
                lineHeight: 1.35,
                maxWidth: 820,
              },
              signature,
            ),
            marque ? marqueEditeur() : null,
          ]),
        ],
      ),
    ],
  );
}

/** La signature de l'éditeur, en bas à droite de l'affiche. */
function marqueEditeur() {
  if (!LOGO) {
    return texte({ fontSize: 17, fontWeight: 600, color: CENDRE, letterSpacing: 3 }, "SLAEGA");
  }

  const hauteur = 36;
  const largeur = Math.round((LOGO.largeur / LOGO.hauteur) * hauteur);

  return {
    type: "img",
    props: {
      src: LOGO.uri,
      width: largeur,
      height: hauteur,
      style: { width: largeur, height: hauteur, opacity: 0.85 },
    },
  };
}

async function enPng(element) {
  const svg = await satori(element, { width: LARGEUR, height: HAUTEUR, fonts: polices });
  return new Resvg(svg, { fitTo: { mode: "width", value: LARGEUR } }).render().asPng();
}

const SIGNATURE = "À quel moment avons-nous trouvé ça normal ?";

async function main() {
  // On repart d'un dossier vide : un CAS supprimé ne doit pas laisser son
  // affiche derrière lui.
  fs.rmSync(SORTIE, { recursive: true, force: true });
  fs.mkdirSync(SORTIE, { recursive: true });

  const fichiers = fs
    .readdirSync(SOURCE)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"));

  const numeros = [];

  for (const fichier of fichiers) {
    const { data, content } = matter(fs.readFileSync(path.join(SOURCE, fichier), "utf8"));
    const slug = String(Number(data.numero)).padStart(3, "0");
    numeros.push({ numero: Number(data.numero), date: data.date ?? null });
    const { texte, signature } = separerSignature(content);

    const png = await enPng(
      affiche({
        numero: `CAS ${slug}`,
        categorie: data.categorie ?? null,
        // Ces textes sont des statuts : à défaut de titre, la première ligne.
        titre: data.titre || premiereLigne(texte),
        extrait: data.extrait ?? null,
        signature: signature ?? SIGNATURE,
      }),
    );

    fs.writeFileSync(path.join(SORTIE, `cas-${slug}.png`), png);
  }

  // L'affiche par défaut : celle du site, pas d'un CAS en particulier.
  const defaut = await enPng(
    affiche({
      numero: "À QUEL MOMENT",
      categorie: null,
      titre: SIGNATURE,
      extrait: null,
      signature: "Une série signée Slaega",
      marque: false,
    }),
  );
  fs.writeFileSync(path.join(SORTIE, "defaut.png"), defaut);

  console.log(
    `Affiches générées : ${fichiers.length + 1} → public/og/` +
      (LOGO ? "" : " (logotype provisoire — public/slaega-mark.png absent)"),
  );

  inventaire(numeros);
}

/**
 * Dit à voix haute ce que le site contient vraiment.
 *
 * Un site statique affiche ses fichiers sans rien réclamer : un CAS jamais
 * déposé ne manque à personne au build, il manque en ligne. Ce relevé rend
 * l'écart visible tout de suite.
 */
function inventaire(entrees) {
  if (entrees.length === 0) {
    console.warn("Aucun CAS dans content/cas/ : le site sera vide.");
    return;
  }

  const tries = [...entrees].sort((a, b) => a.numero - b.numero);
  const numeros = tries.map((e) => e.numero);
  const premier = numeros[0];
  const dernier = numeros[numeros.length - 1];

  const manquants = [];
  for (let n = premier; n <= dernier; n += 1) {
    if (!numeros.includes(n)) manquants.push(String(n).padStart(3, "0"));
  }

  console.log(
    `CAS ${String(premier).padStart(3, "0")} → ${String(dernier).padStart(3, "0")} ` +
      `(${tries.length} texte${tries.length > 1 ? "s" : ""})`,
  );

  if (manquants.length > 0) {
    console.warn(`  Trous dans la numérotation : ${manquants.join(", ")}`);
  }

  // Une date antérieure à celle d'un CAS plus ancien se lit comme une erreur
  // de saisie : l'archive est classée par numéro, les dates doivent suivre.
  const sansDate = tries.filter((e) => !e.date).map((e) => String(e.numero).padStart(3, "0"));
  if (sansDate.length > 0) {
    console.log(`  Sans date : ${sansDate.join(", ")}`);
  }

  const dates = tries.filter((e) => e.date);
  const reculs = dates
    .slice(1)
    .filter((e, i) => e.date < dates[i].date)
    .map((e) => `${String(e.numero).padStart(3, "0")} (${e.date})`);

  if (reculs.length > 0) {
    console.warn(`  Dates qui reculent par rapport au CAS précédent : ${reculs.join(", ")}`);
  }
}

await main();
