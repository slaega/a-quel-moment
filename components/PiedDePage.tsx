import Link from "next/link";
import { nav, site } from "@/lib/site";

export default function PiedDePage() {
  return (
    <footer className="mt-12 border-t border-trait md:mt-20">
      <div className="mx-auto flex max-w-page flex-col gap-10 px-6 py-12 md:flex-row md:items-end md:justify-between md:px-10">
        <p className="max-w-lecture font-serif text-xl leading-snug text-craie italic md:text-2xl">
          {site.signature}
        </p>

        <div className="flex flex-col gap-3 text-sm md:items-end">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {nav.map((lien) => (
              <li key={lien.href}>
                <Link
                  href={lien.href}
                  className="text-cendre transition-colors hover:text-craie"
                >
                  {lien.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-cendre">
            Une série signée {site.auteur} · {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
