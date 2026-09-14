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
  if (titre.length > 64) return 52;
  if (titre.length > 40) return 62;
  return 74;
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
              { fontSize: 34, fontFamily: "Lora", fontStyle: "italic", color: CRAIE, maxWidth: 780 },
              signature,
            ),
            marque ? texte({ fontSize: 19, color: CENDRE, letterSpacing: 1.2 }, "slaega") : null,
          ]),
        ],
      ),
    ],
  );
}

async function enPng(element) {
  const svg = await satori(element, { width: LARGEUR, height: HAUTEUR, fonts: polices });
  return new Resvg(svg, { fitTo: { mode: "width", value: LARGEUR } }).render().asPng();
}

const SIGNATURE = "À quel moment avons-nous trouvé ça normal ?";

async function main() {
  fs.mkdirSync(SORTIE, { recursive: true });

  const fichiers = fs
    .readdirSync(SOURCE)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"));

  for (const fichier of fichiers) {
    const { data } = matter(fs.readFileSync(path.join(SOURCE, fichier), "utf8"));
    const slug = String(Number(data.numero)).padStart(3, "0");

    const png = await enPng(
      affiche({
        numero: `CAS ${slug}`,
        categorie: data.categorie,
        titre: data.titre,
        extrait: data.extrait,
        signature: SIGNATURE,
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

  console.log(`Affiches générées : ${fichiers.length + 1} → public/og/`);
}

await main();
