import PiedDePage from "@/components/PiedDePage";
import { getLogo } from "@/lib/logo";

/**
 * Le corps d'une page, et son pied.
 *
 * Le pied de page reprend la question de clôture du texte lu, pas une
 * question générique.
 *
 * Les vingt et un CAS la posent aujourd'hui à l'identique, si bien que la
 * distinction ne se voit plus. Elle reste pourtant nécessaire : la question
 * est lue dans chaque fichier (voir lib/cas.ts), et le jour où un texte la
 * reformule, le pied suivra le texte au lieu de le contredire. La mise en
 * page racine, elle, ne sait pas quel texte est lu.
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
