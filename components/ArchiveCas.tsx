"use client";

import { useMemo, useState } from "react";
import LigneCas, { type EntreeCas } from "@/components/LigneCas";

export type { EntreeCas };

/**
 * L'archive filtrable.
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

  const visibles = useMemo(
    () => (filtre ? entrees.filter((e) => e.categorie === filtre) : entrees),
    [entrees, filtre],
  );

  return (
    <>
      {/* Défilement horizontal sur téléphone plutôt qu'un pavé de boutons qui
          repousse le sommaire sous la ligne de flottaison. */}
      <div
        role="group"
        aria-label="Filtrer par catégorie"
        className="-mx-[max(1.25rem,min(0.6rem+3.2vw,3.5rem))] flex gap-x-2 overflow-x-auto px-[max(1.25rem,min(0.6rem+3.2vw,3.5rem))] pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0 [&::-webkit-scrollbar]:hidden"
      >
        <Puce actif={filtre === null} onClick={() => setFiltre(null)}>
          Tous <Compteur n={entrees.length} />
        </Puce>
        {categories.map((c) => (
          <Puce key={c.nom} actif={filtre === c.nom} onClick={() => setFiltre(c.nom)}>
            {c.nom} <Compteur n={c.total} />
          </Puce>
        ))}
      </div>

      <p aria-live="polite" className="sr-only">
        {visibles.length} CAS affichés.
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
