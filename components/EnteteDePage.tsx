/** L'en-tête d'une page de texte : surtitre, titre, chapô. */
export default function EnteteDePage({
  surtitre,
  titre,
  chapo,
}: {
  surtitre?: string;
  titre: string;
  chapo?: string;
}) {
  return (
    <header className="mb-12 md:mb-16">
      {surtitre && <p className="surtitre text-discret">{surtitre}</p>}
      <h1 className="manchette mt-7 max-w-[18ch] text-manchette-2">{titre}</h1>
      {chapo && (
        <p className="mt-7 max-w-lecture font-serif text-chapo text-encre/75">{chapo}</p>
      )}
    </header>
  );
}
