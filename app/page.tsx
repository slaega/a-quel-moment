import Link from "next/link";
import CarteCas from "@/components/CarteCas";
import { getDernierCas, getTousLesCas } from "@/lib/cas";
import { site } from "@/lib/site";

export default function Accueil() {
  const dernier = getDernierCas();
  const total = getTousLesCas().length;

  return (
    <>
      {/* Le manifeste, seul. */}
      <section className="mx-auto max-w-page px-6 pt-24 pb-20 text-center md:px-10 md:pt-40 md:pb-28">
        <p className="surtitre text-cendre">Une série signée {site.auteur}</p>

        <h1 className="titre-affiche mx-auto mt-10 max-w-4xl text-[2.5rem] sm:text-6xl md:text-7xl lg:text-[5.25rem]">
          À quel moment avons-nous trouvé ça{" "}
          <em className="font-serif font-normal italic">normal</em>
          <span className="text-rouge"> ?</span>
        </h1>
      </section>

      {/* Le principe, en quatre phrases. */}
      <section className="mx-auto max-w-page border-t border-trait px-6 py-16 md:px-10 md:py-20">
        <div className="grid gap-10 md:grid-cols-[14rem_1fr] md:gap-16">
          <h2 className="surtitre text-cendre">Le principe</h2>
          <div className="max-w-lecture space-y-6 text-lg leading-relaxed text-craie/80 md:text-xl">
            <p>
              Chaque CAS part d&apos;un fait réel. Pas une opinion, pas une théorie : une
              scène que tout le monde a déjà vue, et devant laquelle tout le monde s&apos;est
              tu.
            </p>
            <p>
              On la raconte en quelques lignes, sans commentaire. On montre ensuite ce
              qu&apos;elle nous a fait accepter — la chose qu&apos;on a laissée devenir normale
              sans jamais l&apos;avoir décidée.
            </p>
            <p>
              Puis on pose la seule question qui reste. Toujours la même, à la fin de
              chaque texte.
            </p>
          </div>
        </div>
      </section>

      {/* Le dernier CAS publié. */}
      {dernier && (
        <section className="mx-auto max-w-page border-t border-trait px-6 py-16 md:px-10 md:py-24">
          <h2 className="surtitre mb-12 text-cendre">Le dernier CAS</h2>
          <CarteCas cas={dernier} />
        </section>
      )}

      <section className="mx-auto max-w-page border-t border-trait px-6 py-16 md:px-10 md:py-20">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-lecture">
            <h2 className="titre-affiche text-3xl md:text-4xl">
              {total} CAS publiés, et la même question à chaque fois.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-cendre">
              L&apos;archive complète, classée par numéro et par catégorie.
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-start gap-3 text-sm md:items-end">
            <Link
              href="/cas/"
              className="border-b border-rouge pb-1 text-craie transition-colors hover:text-rouge-vif"
            >
              Voir tous les CAS
            </Link>
            <Link
              href="/philosophie/"
              className="border-b border-trait pb-1 text-cendre transition-colors hover:border-rouge hover:text-craie"
            >
              Lire la philosophie de la série
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
