import { site } from "@/lib/site";

/**
 * La question qui clôt un texte, précédée de son filet rouge.
 *
 * Elle porte la plus grande taille de la page après le titre : c'est le point
 * d'arrivée du texte, pas une mention de fin.
 */
export default function Signature({ texte = site.signature }: { texte?: string }) {
  return (
    <div>
      <span aria-hidden="true" className="block h-px w-16 bg-rouge" />
      <p className="mt-8 font-serif text-question leading-(--text-question--line-height) text-encre italic">
        {texte}
      </p>
    </div>
  );
}
