import type { Root, Text, PhrasingContent } from "mdast";
import { visit } from "unist-util-visit";

/**
 * Transforme les renvois d'un CAS à un autre en liens.
 *
 * Les textes sont écrits en français ordinaire, pas en Markdown : un
 * `[d'autres CAS](/cas/)` écrit à la main se retrouverait tel quel dans le
 * bouton « copier », qui prend le fichier brut — et le texte publié ailleurs
 * porterait une syntaxe de balisage. Les renvois sont donc reconnus au rendu,
 * et les fichiers restent lisibles tels quels.
 *
 * Le signal est la capitale. L'auteur écrit « CAS » pour la série et « cas »
 * pour le mot courant ; on ne touche jamais au second, ce qui évite de
 * transformer « en tout cas » ou « dans ce cas » en lien.
 *
 * Deux renvois seulement, et aucune devinette :
 *
 * - « CAS 015 », « CAS #15 » → la page de ce CAS, s'il existe et si ce n'est
 *   pas celui qu'on est en train de lire.
 * - « d'autres CAS », « les autres CAS » → l'archive. Le pluriel avec
 *   « autres » est ce qui distingue le renvoi de l'auto-désignation : « Ce CAS
 *   est une contribution » parle de lui-même et reste du texte.
 */
const MENTION = /\b(autres\s+)?CAS(?:\s*(?:n[°o]\s*)?#?\s*(\d{1,3})\b)?/g;

export interface OptionsRenvois {
  /** Numéros de CAS publiés : on ne lie jamais vers une page absente. */
  existants: ReadonlySet<number>;
  /** Numéro du CAS en cours, pour ne pas le faire pointer sur lui-même. */
  courant: number;
}

function lien(url: string, texte: string): PhrasingContent {
  return { type: "link", url, children: [{ type: "text", value: texte }] };
}

/** Découpe un nœud texte en texte et liens. Renvoie null si rien ne change. */
function decouper(valeur: string, o: OptionsRenvois): PhrasingContent[] | null {
  const morceaux: PhrasingContent[] = [];
  let curseur = 0;
  MENTION.lastIndex = 0;

  for (let m = MENTION.exec(valeur); m !== null; m = MENTION.exec(valeur)) {
    const [entier, autres, chiffres] = m;
    let avant = entier;
    let ancre: PhrasingContent | null = null;

    if (chiffres !== undefined) {
      const numero = Number(chiffres);
      if (o.existants.has(numero) && numero !== o.courant) {
        // Un éventuel « autres » reste du texte : l'ancre, c'est « CAS 013 ».
        avant = autres ?? "";
        ancre = lien(`/cas/${String(numero).padStart(3, "0")}/`, entier.slice(avant.length));
      }
    } else if (autres !== undefined) {
      // Seul « CAS » devient le lien ; « d'autres » reste du texte.
      avant = autres;
      ancre = lien("/cas/", "CAS");
    }

    if (!ancre) continue;

    const texte = valeur.slice(curseur, m.index) + avant;
    if (texte !== "") morceaux.push({ type: "text", value: texte });
    morceaux.push(ancre);
    curseur = m.index + entier.length;
  }

  if (morceaux.length === 0) return null;
  const reste = valeur.slice(curseur);
  if (reste !== "") morceaux.push({ type: "text", value: reste });
  return morceaux;
}

/** Greffon remark : relie les renvois, sans jamais entrer dans un lien. */
export function remarkRenvois(o: OptionsRenvois) {
  return (arbre: Root) => {
    visit(arbre, "text", (noeud: Text, index, parent) => {
      if (!parent || index === undefined || parent.type === "link") return;
      const morceaux = decouper(noeud.value, o);
      if (!morceaux) return;
      parent.children.splice(index, 1, ...morceaux);
      return index + morceaux.length;
    });
  };
}
