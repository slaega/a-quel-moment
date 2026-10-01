import type { Source } from "@/lib/cas";

/**
 * Les références, sous la question de clôture.
 *
 * Elles viennent après la question, jamais avant : la question est le dernier
 * mot du texte, l'appareil critique se lit une fois le texte fini. Elles
 * portent la seconde encre, comme tout ce qui référence plutôt que de parler.
 */
export default function Sources({ sources }: { sources: Source[] }) {
  if (sources.length === 0) return null;

  return (
    <footer className="mt-14 max-w-lecture border-t border-trait pt-8 md:mt-16">
      <h2 className="surtitre text-discret">
        {sources.length > 1 ? "Sources" : "Source"}
      </h2>
      <ul className="mt-5 space-y-3 text-[0.9375rem] leading-relaxed">
        {sources.map((s) => (
          <li key={s.url} className="flex gap-3">
            <span aria-hidden="true" className="shrink-0 text-seconde">
              ↗
            </span>
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="lien-sobre text-discret hover:text-seconde"
            >
              {s.titre}
            </a>
          </li>
        ))}
      </ul>
    </footer>
  );
}
