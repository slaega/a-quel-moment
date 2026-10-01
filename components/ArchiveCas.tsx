"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import LigneCas, { type EntreeCas } from "@/components/LigneCas";

export type { EntreeCas };

/** Le paramètre d'URL qui porte le filtre. */
const CLE = "categorie";

/**
 * L'archive filtrable.
 *
 * Le filtre vit dans l'URL, pas seulement dans la mémoire du navigateur.
 * Tant qu'il n'y était pas, rien ne pouvait renvoyer vers une catégorie :
 * ni la catégorie affichée sous un CAS, ni un lien partagé, ni le bouton
 * « page précédente ». C'était la pièce manquante — tout le reste en découle.
 *
 * Le filtre est une barre de catégories, pas un menu déroulant : vingt textes
 * et douze catégories tiennent à l'écran, et voir la répartition fait partie
 * de la lecture de l'archive. Les compteurs restent affichés pour ça.
 *
 * Les lignes sont celles de l'accueil (components/LigneCas) : un seul dessin
 * de sommaire pour tout le site.
 */
export default function ArchiveCas({
  entrees,
  categories,
}: {
  entrees: EntreeCas[];
  categories: { nom: string; total: number }[];
}) {
  const [filtre, setFiltre] = useState<string | null>(null);
  const barre = useRef<HTMLDivElement>(null);

  const connue = useCallback(
    (nom: string | null) => (nom && categories.some((c) => c.nom === nom) ? nom : null),
    [categories],
  );

  /*
   * L'URL est lue après le premier rendu, et non pendant : le site est
   * exporté en statique, le serveur ne connaît donc pas le paramètre. La
   * lire au rendu produirait un écart d'hydratation.
   *
   * « popstate » est écouté pour que le bouton « page précédente » rétablisse
   * le filtre précédent au lieu de quitter la page.
   */
  useEffect(() => {
    const lire = () =>
      setFiltre(connue(new URLSearchParams(window.location.search).get(CLE)));
    lire();
    window.addEventListener("popstate", lire);
    return () => window.removeEventListener("popstate", lire);
  }, [connue]);

  // La catégorie active est amenée dans le champ de vision : sur téléphone la
  // barre défile, et elle peut être hors écran à l'arrivée.
  useEffect(() => {
    barre.current
      ?.querySelector('[aria-pressed="true"]')
      ?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [filtre]);

  const choisir = (nom: string | null) => {
    setFiltre(nom);
    const url = new URL(window.location.href);
    if (nom) url.searchParams.set(CLE, nom);
    else url.searchParams.delete(CLE);
    // pushState plutôt que replaceState : chaque filtre devient une étape
    // que le bouton « page précédente » peut défaire.
    window.history.pushState(null, "", url);
  };

  const visibles = useMemo(
    () => (filtre ? entrees.filter((e) => e.categorie === filtre) : entrees),
    [entrees, filtre],
  );

  return (
    <>
      {/* Défilement horizontal sur téléphone plutôt qu'un pavé de boutons qui
          repousse le sommaire sous la ligne de flottaison. Le fondu à droite
          dit que la barre continue ; il disparaît dès md, où elle passe à la
          ligne au lieu de défiler. */}
      <div
        ref={barre}
        role="group"
        aria-label="Filtrer par catégorie"
        className="-mx-[max(1.25rem,min(0.6rem+3.2vw,3.5rem))] flex gap-x-2 overflow-x-auto px-[max(1.25rem,min(0.6rem+3.2vw,3.5rem))] pb-1 [mask-image:linear-gradient(to_right,#000_calc(100%-3rem),transparent)] [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0 md:[mask-image:none] [&::-webkit-scrollbar]:hidden"
      >
        <Puce actif={filtre === null} onClick={() => choisir(null)}>
          Tous <Compteur n={entrees.length} />
        </Puce>
        {categories.map((c) => (
          <Puce key={c.nom} actif={filtre === c.nom} onClick={() => choisir(c.nom)}>
            {c.nom} <Compteur n={c.total} />
          </Puce>
        ))}
      </div>

      <p aria-live="polite" className="sr-only">
        {visibles.length} CAS affichés{filtre ? ` dans la catégorie ${filtre}` : ""}.
      </p>

      {visibles.length > 0 ? (
        <ul className="mt-10 border-t border-trait md:mt-14">
          {visibles.map((e) => (
            <LigneCas key={e.slug} cas={e} />
          ))}
        </ul>
      ) : (
        <p className="mt-14 border-y border-trait py-20 text-center font-serif text-chapo text-discret italic">
          Aucun CAS dans cette catégorie, pour l&apos;instant.
        </p>
      )}
    </>
  );
}

function Compteur({ n }: { n: number }) {
  return <span className="chiffres opacity-55">{n}</span>;
}

function Puce({
  actif,
  onClick,
  children,
}: {
  actif: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={actif}
      className={
        "surtitre inline-flex min-h-11 shrink-0 items-center gap-[0.5em] rounded-full border px-4 whitespace-nowrap transition-colors " +
        (actif
          ? "border-seconde bg-seconde-voile text-seconde"
          : "border-trait text-discret hover:border-discret hover:text-encre")
      }
    >
      {children}
    </button>
  );
}
