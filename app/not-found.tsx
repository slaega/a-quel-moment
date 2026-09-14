import Link from "next/link";

export default function Introuvable() {
  return (
    <div className="mx-auto max-w-page px-6 py-32 md:px-10 md:py-48">
      <p className="surtitre text-rouge">Erreur 404</p>
      <h1 className="titre-affiche mt-8 max-w-2xl text-4xl md:text-6xl">
        Ce CAS n&apos;existe pas. Pas encore.
      </h1>
      <Link
        href="/cas/"
        className="mt-10 inline-block border-b border-rouge pb-1 text-sm text-craie transition-colors hover:text-rouge-vif"
      >
        Revenir à l&apos;archive
      </Link>
    </div>
  );
}
