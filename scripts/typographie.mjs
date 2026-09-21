/**
 * Applique aux CAS les conventions typographiques de la série.
 *
 * Ces textes arrivent tapés au fil de la plume — apostrophes droites, guillemets
 * droits, espaces ordinaires. Les corriger à la main à chaque ajout finit par
 * produire des oublis : la règle vit donc ici, et s'applique d'un coup.
 *
 * Le frontmatter et le corps ne reçoivent pas le même traitement. Les guillemets
 * y délimitent les valeurs YAML : les transformer en chevrons casserait le
 * fichier. Seules les règles inoffensives lui sont appliquées.
 *
 * Les espaces avant « : », « ; », « ! » et « ? » restent ordinaires : les
 * corriger toutes changerait chaque ligne pour un gain invisible.
 *
 *   npm run typo
 */
import fs from "node:fs";
import path from "node:path";

const NBSP = " ";
const DOSSIER = path.join(process.cwd(), "content", "cas");

/** Sans danger partout, frontmatter compris. */
const reglesSures = [
  {
    nom: "apostrophes typographiques",
    appliquer: (t) => t.replaceAll("'", "’"),
  },
  {
    nom: "espace insécable dans les milliers",
    appliquer: (t) => t.replace(/(\d) (\d{3})(?!\d)/g, `$1${NBSP}$2`),
  },
  {
    nom: "espace insécable avant le pourcentage",
    appliquer: (t) => t.replace(/(\d) %/g, `$1${NBSP}%`),
  },
  {
    nom: "espace insécable dans les guillemets",
    appliquer: (t) => t.replaceAll("« ", `«${NBSP}`).replaceAll(" »", `${NBSP}»`),
  },
];

/** Réservé au corps du texte. */
const reglesDuCorps = [
  {
    nom: "guillemets droits convertis en chevrons",
    appliquer: (t) => t.replace(/"([^"\n]+)"/g, `«${NBSP}$1${NBSP}»`),
  },
];

/** Sépare le frontmatter du corps, sans toucher aux délimiteurs. */
function decouper(contenu) {
  const m = contenu.match(/^(---\r?\n[\s\S]*?\r?\n---\r?\n)([\s\S]*)$/);
  return m ? { entete: m[1], corps: m[2] } : { entete: "", corps: contenu };
}

function appliquer(texte, regles, journal) {
  let resultat = texte;
  for (const regle of regles) {
    const suivant = regle.appliquer(resultat);
    if (suivant !== resultat) journal.add(regle.nom);
    resultat = suivant;
  }
  return resultat;
}

let total = 0;

for (const fichier of fs.readdirSync(DOSSIER).filter((f) => f.endsWith(".md")).sort()) {
  const chemin = path.join(DOSSIER, fichier);
  const avant = fs.readFileSync(chemin, "utf8");
  const { entete, corps } = decouper(avant);

  const journal = new Set();
  const apres =
    appliquer(entete, reglesSures, journal) +
    appliquer(appliquer(corps, reglesDuCorps, journal), reglesSures, journal);

  if (apres !== avant) {
    fs.writeFileSync(chemin, apres);
    console.log(`${fichier} : ${[...journal].join(", ")}`);
    total += 1;
  }
}

console.log(
  total === 0
    ? "Rien à corriger."
    : `${total} fichier${total > 1 ? "s" : ""} corrigé${total > 1 ? "s" : ""}.`,
);
