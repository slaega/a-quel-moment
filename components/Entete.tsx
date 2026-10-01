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
 * Il ne se replie pas en menu hamburger : trois entrées tiennent sur une
 * ligne dès 320 px si on les compose en capitales étroites. Un menu caché
 * derrière un bouton coûterait un geste de plus pour masquer trois mots.
 *
 * Le nom et la navigation sont donc sur deux rangs sur téléphone, un seul
 * dès la tablette — sans rien escamoter.
 *
 * Et il ne colle au haut de l'écran qu'à partir de la tablette. Sur
 * téléphone, ses deux rangs font 121 px : collé, il prendrait 18 % d'un
 * écran de 667 px pendant toute la lecture d'un texte. C'est le contraire de
 * ce que demande une série qui se lit d'une traite sur téléphone.
 *
 * Le fond est opaque. Un bandeau translucide laissait transparaître le texte
 * qui défilait dessous, et une serif vue au travers d'un voile se lit mal.
 */
export default function Entete({ logo }: { logo: Logo | null }) {
  const chemin = usePathname();

  return (
    <header className="z-40 border-b border-trait bg-fond sm:sticky sm:top-0">
      <div className="gouttiere mx-auto flex max-w-page flex-col gap-y-2 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-x-10 sm:py-4">
        <div className="flex items-center justify-between gap-4 sm:justify-start">
          <Link
            href="/"
            className="group cible gap-px font-(family-name:--font-titre) text-[1.0625rem] tracking-tight text-encre sm:text-lg"
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
            className="cible shrink-0 text-discret transition-opacity hover:opacity-70"
          >
            <LogoSlaega logo={logo} hauteur={17} />
          </a>
        </div>

        <div className="flex items-center justify-between gap-x-5 sm:justify-end sm:gap-x-7">
          <nav aria-label="Navigation principale">
            <ul className="flex items-center gap-x-5 sm:gap-x-7">
              {nav.map((lien) => {
                const actif = chemin === lien.href || chemin.startsWith(lien.href);
                return (
                  <li key={lien.href}>
                    <Link
                      href={lien.href}
                      aria-current={actif ? "page" : undefined}
                      className={
                        // Sur téléphone, l'interlettrage des capitales est
                        // resserré : à pleine chasse, les trois entrées
                        // débordent de la ligne et se coupent en deux.
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
