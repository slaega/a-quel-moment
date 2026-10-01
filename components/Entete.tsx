"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import BasculeTheme from "@/components/BasculeTheme";
import LogoSlaega from "@/components/LogoSlaega";
import type { Logo } from "@/lib/logo";
import { nav, site } from "@/lib/site";

/**
 * Le bandeau de titre.
 *
 * UN SEUL RANG, PARTOUT. Sur téléphone il en occupait deux, soit 121 px —
 * près d'un cinquième d'un écran de 667 px, pris à la lecture avant même le
 * premier mot. C'était trop pour une série qui se lit d'une traite au
 * téléphone.
 *
 * Trois entrées, un nom et une bascule ne tiennent pas sur une ligne de
 * 320 px sans composer les libellés trop petit. Sous 640 px, le bandeau ne
 * garde donc que « Les CAS » : c'est la seule destination dont un lecteur a
 * besoin en cours de route. « Philosophie » et « À propos » restent atteignables
 * depuis le pied de page, présent sur chaque page, et depuis l'accueil.
 *
 * Pas de menu replié derrière un bouton : cacher deux liens derrière un geste
 * supplémentaire coûte plus qu'il ne rapporte, et laisse un bandeau presque
 * vide.
 *
 * Il ne colle au haut de l'écran qu'à partir de 640 px — voir plus bas.
 * Le fond est opaque : un bandeau translucide laissait transparaître le texte
 * qui défilait dessous, et une serif vue au travers d'un voile se lit mal.
 */
export default function Entete({ logo }: { logo: Logo | null }) {
  const chemin = usePathname();

  return (
    <header className="z-40 border-b border-trait bg-fond sm:sticky sm:top-0">
      <div className="gouttiere mx-auto flex max-w-page items-center justify-between gap-x-5 py-2 sm:gap-x-10 sm:py-3">
        <div className="flex items-center gap-3 sm:gap-3.5">
          <Link
            href="/"
            className="group cible gap-px font-(family-name:--font-titre) text-base tracking-tight whitespace-nowrap text-encre sm:text-lg"
          >
            {site.nom}
            <span className="text-rouge transition-transform duration-200 group-hover:translate-y-px">
              ?
            </span>
          </Link>

          <span aria-hidden="true" className="hidden h-4 w-px bg-trait sm:block" />

          <a
            href={site.editeurUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`${site.auteur}, éditeur de la série`}
            // Masqué sur téléphone : la marque de l'éditeur tient dans le
            // pied de page, et les 30 px qu'elle prend ici font déborder la
            // ligne à 320 px.
            className="cible hidden shrink-0 text-discret transition-opacity hover:opacity-70 sm:inline-flex"
          >
            <LogoSlaega logo={logo} hauteur={16} />
          </a>
        </div>

        <div className="flex items-center gap-x-4 sm:gap-x-7">
          <nav aria-label="Navigation principale">
            <ul className="flex items-center gap-x-5 sm:gap-x-7">
              {nav.map((lien, i) => {
                const actif = chemin === lien.href || chemin.startsWith(lien.href);
                return (
                  <li
                    key={lien.href}
                    // Seule la première entrée tient sur un téléphone.
                    className={i === 0 ? "" : "hidden sm:block"}
                  >
                    <Link
                      href={lien.href}
                      aria-current={actif ? "page" : undefined}
                      className={
                        // L'interlettrage des capitales est resserré sur
                        // téléphone : à pleine chasse, le libellé se coupe.
                        "surtitre cible relative whitespace-nowrap text-[0.75rem] tracking-[0.09em] transition-colors sm:text-meta sm:tracking-[0.16em] " +
                        (actif ? "text-encre" : "text-discret hover:text-encre")
                      }
                    >
                      {lien.label}
                      {/* Le repère de page courante : un filet rouge, pas une
                          couleur de texte — la lisibilité reste maximale. */}
                      {actif && (
                        <span
                          aria-hidden="true"
                          className="absolute inset-x-0 bottom-1.5 h-px bg-rouge"
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <BasculeTheme />
        </div>
      </div>
    </header>
  );
}
