"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav, site } from "@/lib/site";

export default function Entete() {
  const chemin = usePathname();

  return (
    <header className="border-b border-trait">
      <div className="mx-auto flex max-w-page flex-wrap items-baseline justify-between gap-x-8 gap-y-3 px-6 py-6 md:px-10">
        <Link
          href="/"
          className="text-[0.9375rem] font-semibold tracking-tight text-craie transition-colors hover:text-rouge-vif"
        >
          {site.nom}
          <span className="text-rouge">?</span>
        </Link>

        <nav aria-label="Navigation principale">
          <ul className="flex flex-wrap items-baseline gap-x-6 gap-y-2 text-sm">
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
                        : "text-cendre transition-colors hover:text-craie"
                    }
                  >
                    {lien.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
