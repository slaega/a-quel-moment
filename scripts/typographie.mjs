/**
 * Applique aux CAS les conventions typographiques de la série.
 *
 * Ces textes arrivent tapés au fil de la plume — apostrophes droites, espaces
 * ordinaires. Les corriger à la main à chaque ajout finit par produire des
 * oublis : la règle vit donc ici, et s'applique d'un coup.
 *
 * Seules sont traitées les espaces dont la rupture se voit à la lecture. Les
 * espaces avant « : », « ; », « ! » et « ? » restent ordinaires : les corriger
 * toutes changerait chaque ligne pour un gain invisible.
 *
 *   npm run typo
 */
import fs from "node:fs";
import path from "node:path";

const NBSP = " ";
const DOSSIER = path.join(process.cwd(), "content", "cas");

const regles = [
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

let total = 0;

for (const fichier of fs.readdirSync(DOSSIER).filter((f) => f.endsWith(".md")).sort()) {
  const chemin = path.join(DOSSIER, fichier);
  const avant = fs.readFileSync(chemin, "utf8");

  let apres = avant;
  const appliquees = [];
  for (const regle of regles) {
    const suivant = regle.appliquer(apres);
    if (suivant !== apres) appliquees.push(regle.nom);
    apres = suivant;
  }

  if (apres !== avant) {
    fs.writeFileSync(chemin, apres);
    console.log(`${fichier} : ${appliquees.join(", ")}`);
    total += 1;
  }
}

console.log(total === 0 ? "Rien à corriger." : `${total} fichier${total > 1 ? "s" : ""} corrigé${total > 1 ? "s" : ""}.`);
