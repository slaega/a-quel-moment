import PiedDePage from "@/components/PiedDePage";
import { getLogo } from "@/lib/logo";

/**
 * Le corps d'une page, et son pied.
 *
 * Le pied de page reprend la question de clôture. Or elle n'est pas la même
 * partout : certains CAS demandent « avons-nous trouvé ça normal ? », d'autres
 * « allons-nous encore trouver ça normal ? ». Laisser la mise en page racine
 * l'afficher reviendrait à contredire l'article juste au-dessus — elle ne sait
 * pas quel texte est lu.
 *
 * Chaque page passe donc la sienne, et le pied vit ici plutôt que dans
 * app/layout.tsx.
 */
export default function Gabarit({
  signature,
  children,
}: {
  /** Question de clôture de cette page. À défaut, celle de la série. */
  signature?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <main id="contenu" className="flex-1">
        {children}
      </main>
      <PiedDePage signature={signature} logo={getLogo()} />
    </>
  );
}
