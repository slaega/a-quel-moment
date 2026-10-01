import Link from "next/link";
import Gabarit from "@/components/Gabarit";

export default function Introuvable() {
  return (
    <Gabarit>
      <div className="gouttiere mx-auto max-w-page py-28 md:py-44">
        <p className="surtitre text-seconde">Erreur 404</p>
        <h1 className="manchette mt-8 max-w-[16ch] text-manchette-2">
          Ce CAS n&apos;existe pas. Pas encore.
        </h1>
        <Link href="/cas/" className="surtitre lien-sobre cible mt-8 text-encre">
          Revenir à l&apos;archive
        </Link>
      </div>
    </Gabarit>
  );
}
