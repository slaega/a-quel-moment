import Link from "next/link";
import EtiquetteCategorie from "@/components/EtiquetteCategorie";

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
 *
 * DEUX DESTINATIONS DANS UNE LIGNE. La ligne entière mène au CAS, et la
 * catégorie mène à l'archive filtrée. Imbriquer un lien dans un lien est
 * interdit : c'est donc le titre qui porte le lien, et son ::after couvre
 * toute la ligne. La catégorie passe au-dessus. Les deux restent des liens
 * distincts au clavier comme au lecteur d'écran.
 */
export default function LigneCas({ cas }: { cas: EntreeCas }) {
  return (
    <li className="group relative grid gap-y-2 border-b border-trait py-6 md:grid-cols-[5rem_1fr_auto] md:gap-x-10 md:gap-y-0 md:py-8">
      {/*
        Sur téléphone, le numéro est posé au-dessus du titre et non à sa
        gauche : en colonne, il décalait le titre, l'extrait et les
        métadonnées sur un second fer, et la ligne se lisait en escalier.
      */}
      <span
        aria-hidden="true"
        className="numero text-lg text-rouge transition-transform duration-200 group-hover:-translate-y-0.5 md:pt-1 md:text-2xl"
      >
        {cas.slug}
      </span>

      <div className="min-w-0">
        <Link
          href={`/cas/${cas.slug}/`}
          className="manchette block text-section text-encre decoration-rouge decoration-1 underline-offset-[0.18em] after:absolute after:inset-0 hover:underline"
        >
          {cas.titre}
        </Link>

        {cas.extrait && (
          <p className="mt-2.5 max-w-lecture text-[0.9375rem] leading-relaxed text-discret md:text-base">
            {cas.extrait}
          </p>
        )}

        {/* Sur téléphone, les métadonnées suivent le titre plutôt que de se
            serrer dans une colonne de droite inexistante. */}
        <div className="relative z-10 mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 md:hidden">
          <Metadonnees cas={cas} />
        </div>
      </div>

      <div className="relative z-10 hidden shrink-0 flex-col items-end gap-2 pt-1 text-right md:flex">
        <Metadonnees cas={cas} />
      </div>
    </li>
  );
}

function Metadonnees({ cas }: { cas: EntreeCas }) {
  return (
    <>
      {cas.categorie && <EtiquetteCategorie nom={cas.categorie} />}
      {cas.dateIso && cas.dateLisible && (
        <time dateTime={cas.dateIso} className="chiffres text-meta text-discret">
          {cas.dateLisible}
        </time>
      )}
    </>
  );
}
