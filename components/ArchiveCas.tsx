"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export interface EntreeCas {
  slug: string;
  titre: string;
  categorie: string;
  extrait: string;
  dateIso: string;
  dateLisible: string;
}

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
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filtrer par catégorie">
        <Chip actif={filtre === null} onClick={() => setFiltre(null)}>
          Tous <span className="tabular-nums opacity-50">{entrees.length}</span>
        </Chip>
        {categories.map((c) => (
          <Chip key={c.nom} actif={filtre === c.nom} onClick={() => setFiltre(c.nom)}>
            {c.nom} <span className="tabular-nums opacity-50">{c.total}</span>
          </Chip>
        ))}
      </div>

      <p aria-live="polite" className="sr-only">
        {visibles.length} CAS affichés.
      </p>

      <ul className="mt-12 border-t border-trait">
        {visibles.map((e) => (
          <li key={e.slug} className="border-b border-trait">
            <Link
              href={`/cas/${e.slug}/`}
              className="group flex flex-col gap-3 py-7 transition-colors md:flex-row md:items-baseline md:gap-8"
            >
              <span className="shrink-0 font-semibold tabular-nums text-rouge md:w-20">
                {e.slug}
              </span>

              <span className="flex-1">
                <span className="block text-xl font-medium tracking-tight text-craie transition-colors group-hover:text-rouge-vif md:text-2xl">
                  {e.titre}
                </span>
                <span className="mt-2 block max-w-lecture text-base leading-relaxed text-cendre">
                  {e.extrait}
                </span>
              </span>

              <span className="flex shrink-0 items-baseline gap-4 text-sm text-cendre md:flex-col md:items-end md:gap-1.5">
                <span className="surtitre">{e.categorie}</span>
                <time dateTime={e.dateIso}>{e.dateLisible}</time>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {visibles.length === 0 && (
        <p className="py-16 text-center text-cendre">Aucun CAS dans cette catégorie.</p>
      )}
    </>
  );
}

function Chip({
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
        "border px-3.5 py-1.5 text-sm transition-colors " +
        (actif
          ? "border-rouge text-rouge-vif"
          : "border-trait text-cendre hover:border-cendre hover:text-craie")
      }
    >
      {children}
    </button>
  );
}
