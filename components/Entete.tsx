"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import BasculeTheme from "@/components/BasculeTheme";
import LogoSlaega from "@/components/LogoSlaega";
import type { Logo } from "@/lib/logo";
import { nav, site } from "@/lib/site";

export default function Entete({ logo }: { logo: Logo | null }) {
  const chemin = usePathname();

  return (
    <header className="border-b border-trait">
      <div className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-x-8 gap-y-3 px-6 py-6 md:px-10">
        <div className="flex items-center gap-3.5">
          <Link
            href="/"
            className="text-[0.9375rem] font-semibold tracking-tight text-encre transition-colors hover:text-rouge-vif"
          >
            {site.nom}
            <span className="text-rouge-vif">?</span>
          </Link>

          <span aria-hidden="true" className="h-3.5 w-px bg-trait" />

          <a
            href={site.editeurUrl}
            target="_blank"
            rel="noreferrer"
            className="text-discret transition-colors hover:text-encre"
          >
            <LogoSlaega logo={logo} hauteur={12} />
          </a>
        </div>

        <div className="flex items-center gap-x-6 gap-y-2">
          <nav aria-label="Navigation principale">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              {nav.map((lien) => {
                const actif = chemin === lien.href || chemin.startsWith(lien.href);
                return (
                  <li key={lien.href}>
                    <Link
                      href={lien.href}
                      aria-current={actif ? "page" : undefined}
                      className={
                        actif
                          ? "text-rouge-vif"
                          : "text-discret transition-colors hover:text-encre"
                      }
                    >
                      {lien.label}
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
