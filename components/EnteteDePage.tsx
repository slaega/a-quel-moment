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
    <header className="mb-14 md:mb-20">
      {surtitre && <p className="surtitre mb-6 text-discret">{surtitre}</p>}
      <h1 className="titre-affiche max-w-3xl text-4xl md:text-6xl">{titre}</h1>
      {chapo && (
        <p className="mt-7 max-w-lecture text-lg leading-relaxed text-discret md:text-xl">
          {chapo}
        </p>
      )}
    </header>
  );
}
