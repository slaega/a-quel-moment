import Link from "next/link";
import EtiquetteCategorie from "@/components/EtiquetteCategorie";
import { formaterDate, type Cas } from "@/lib/cas";

/**
 * Le CAS en une.
 *
 * Composition asymétrique : les repères (numéro, catégorie, date) tiennent un
 * rail à gauche sur grand écran, le texte garde toute la colonne. Le filet
 * rouge vertical est le seul ornement — c'est la marque de la série, reprise
 * telle quelle sur la page de lecture.
 */
export default function CarteCas({ cas }: { cas: Cas }) {
  const date = formaterDate(cas.date);

  return (
    <article className="grid gap-y-6 border-l-2 border-rouge pl-5 sm:pl-8 md:grid-cols-[9rem_1fr] md:gap-x-12 md:pl-12">
      <div className="md:pt-3">
        <span className="numero block text-3xl text-rouge md:text-4xl">{cas.slug}</span>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 md:mt-4 md:flex-col md:items-start md:gap-y-3">
          {cas.categorie && <EtiquetteCategorie nom={cas.categorie} />}
          {date && cas.date && (
            <time dateTime={cas.date} className="chiffres text-meta text-discret">
              {date}
            </time>
          )}
        </div>
      </div>

      <div className="min-w-0">
        <h3 className="manchette text-manchette-2">
          <Link
            href={`/cas/${cas.slug}/`}
            className="decoration-rouge decoration-1 underline-offset-[0.14em] hover:underline"
          >
            {cas.titre}
          </Link>
        </h3>

        {cas.extrait && (
          <p className="mt-6 max-w-lecture font-serif text-chapo text-encre/80">{cas.extrait}</p>
        )}

        {cas.signature && (
          <p className="mt-8 max-w-lecture font-serif text-chapo text-encre italic">
            {cas.signature}
          </p>
        )}

        <Link
          href={`/cas/${cas.slug}/`}
          className="group cible mt-7 gap-2.5 text-meta text-encre"
        >
          <span className="surtitre">Lire le CAS {cas.slug}</span>
          <span
            aria-hidden="true"
            className="h-px w-8 bg-rouge transition-[width] duration-200 group-hover:w-12"
          />
        </Link>
      </div>
    </article>
  );
}
