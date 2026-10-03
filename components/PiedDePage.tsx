import Link from "next/link";
import SignatureEditeur from "@/components/SignatureEditeur";
import type { Logo } from "@/lib/logo";
import { nav, site } from "@/lib/site";

/**
 * Le pied reprend la question de la page lue — celle du CAS, pas celle de la
 * série. C'est la raison d'être de components/Gabarit.
 *
 * Elle est composée ici en grand : arrivé en bas d'un texte, le lecteur doit
 * retomber sur la question plutôt que sur un plan de site.
 */
export default function PiedDePage({
  logo,
  signature,
}: {
  logo: Logo | null;
  /** Question de clôture de la page. À défaut, celle de la série. */
  signature?: string;
}) {
  return (
    <footer className="mt-(--spacing-mouvement) border-t border-trait">
      <div className="gouttiere mx-auto max-w-page py-14 md:py-20">
        {/*
          Sur la page d'un CAS, la question est celle du texte qu'on vient de
          lire. Ailleurs, c'est celle qui donne son nom à la série.
        */}
        <p className="max-w-[22ch] font-serif text-question leading-(--text-question--line-height) text-encre italic sm:max-w-[28ch]">
          {signature ?? site.signature}
        </p>

        <div className="mt-12 flex flex-col gap-8 border-t border-trait pt-8 sm:flex-row sm:items-start sm:justify-between md:mt-16">
          <nav aria-label="Navigation de pied de page">
            <ul className="flex flex-wrap gap-x-7 gap-y-1">
              {nav.map((lien) => (
                <li key={lien.href}>
                  <Link
                    href={lien.href}
                    className="surtitre lien-sobre cible text-discret hover:text-encre"
                  >
                    {lien.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-meta text-discret sm:justify-end">
            <SignatureEditeur prefixe="Une série signée" logo={logo} />
            <span aria-hidden="true" className="text-trait">
              /
            </span>
            <span className="chiffres">{new Date().getFullYear()}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
