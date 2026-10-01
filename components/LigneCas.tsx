import Link from "next/link";

export interface EntreeCas {
  slug: string;
  titre: string;
  categorie: string | null;
  extrait: string | null;
  dateIso: string | null;
  dateLisible: string | null;
}

/**
 * Une entrée de sommaire.
 *
 * C'est la brique partagée par l'accueil et l'archive : un seul dessin de
 * ligne, un seul comportement au survol, et rien à resynchroniser entre deux
 * pages quand la composition bouge.
 *
 * La mise en page est celle d'un sommaire de revue, pas d'une carte de blog :
 * le numéro tient une colonne à lui, le titre occupe la largeur, et les
 * métadonnées se rangent à droite sur grand écran, sous le titre sur
 * téléphone. Aucune ombre, aucun cadre — un filet suffit à séparer.
 */
export default function LigneCas({ cas }: { cas: EntreeCas }) {
  return (
    <li className="border-b border-trait">
      <Link
        href={`/cas/${cas.slug}/`}
        className="group grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 py-6 sm:gap-x-7 md:grid-cols-[5rem_1fr_auto] md:gap-x-10 md:py-8"
      >
        <span
          aria-hidden="true"
          className="chiffres pt-1 font-serif text-xl text-rouge transition-transform duration-200 group-hover:-translate-y-0.5 md:text-2xl"
        >
          {cas.slug}
        </span>

        <span className="min-w-0">
          <span className="manchette block text-section text-encre decoration-rouge decoration-1 underline-offset-[0.18em] group-hover:underline">
            {cas.titre}
          </span>
          {cas.extrait && (
            <span className="mt-2.5 block max-w-lecture text-[0.9375rem] leading-relaxed text-discret md:text-base">
              {cas.extrait}
            </span>
          )}
          {/* Sur téléphone, les métadonnées suivent le titre plutôt que de
              se serrer dans une colonne de droite inexistante. */}
          <span className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 md:hidden">
            <Metadonnees cas={cas} />
          </span>
        </span>

        <span className="hidden shrink-0 flex-col items-end gap-1.5 pt-1 text-right md:flex">
          <Metadonnees cas={cas} />
        </span>
      </Link>
    </li>
  );
}

function Metadonnees({ cas }: { cas: EntreeCas }) {
  return (
    <>
      {cas.categorie && <span className="surtitre text-seconde">{cas.categorie}</span>}
      {cas.dateIso && cas.dateLisible && (
        <time dateTime={cas.dateIso} className="chiffres text-meta text-discret">
          {cas.dateLisible}
        </time>
      )}
    </>
  );
}
