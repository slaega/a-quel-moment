import Link from "next/link";

/** L'URL de l'archive filtrée sur une catégorie. */
export function versCategorie(nom: string): string {
  return `/cas/?categorie=${encodeURIComponent(nom)}`;
}

/**
 * La catégorie d'un CAS, cliquable.
 *
 * C'est la porte d'entrée la plus naturelle vers le reste de la série : on
 * finit un texte sur l'identité, on touche « IDENTITÉ », on a les autres.
 * Sans ça il fallait revenir à l'archive et retrouver le filtre à la main —
 * trois gestes au lieu d'un, et un de trop sur téléphone.
 *
 * Le cadre reste visible en permanence plutôt qu'au survol : sur un écran
 * tactile il n'y a pas de survol, et rien ne distinguait une catégorie
 * cliquable d'une simple mention.
 */
export default function EtiquetteCategorie({
  nom,
  className = "",
}: {
  nom: string;
  className?: string;
}) {
  return (
    <Link
      href={versCategorie(nom)}
      className={
        // La zone sensible est étendue à 44 px par un pseudo-élément, sans
        // grossir l'étiquette : un cadre de 44 px de haut à côté d'une date
        // pèserait beaucoup trop dans un sommaire.
        "surtitre relative z-10 inline-flex items-center rounded-full border border-seconde/35 px-2.5 py-1.5 " +
        "text-seconde transition-colors after:absolute after:-inset-x-1.5 after:-inset-y-2 " +
        "hover:border-seconde hover:bg-seconde-voile " +
        className
      }
    >
      {nom}
    </Link>
  );
}
