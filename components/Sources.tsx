import type { Source } from "@/lib/cas";

/**
 * Les références, sous la question de clôture.
 *
 * Elles viennent après la signature, jamais avant : la question est le dernier
 * mot du texte, l'appareil critique se lit une fois le texte fini. D'où aussi
 * le corps réduit et la couleur discrète — ce n'est pas du texte, c'est de quoi
 * le vérifier.
 */
export default function Sources({ sources }: { sources: Source[] }) {
  if (sources.length === 0) return null;

  return (
    <footer className="mt-12 max-w-lecture">
      <h2 className="surtitre text-discret">
        {sources.length > 1 ? "Sources" : "Source"}
      </h2>
      <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-discret">
        {sources.map((s) => (
          <li key={s.url} className="flex gap-2.5">
            <span aria-hidden="true" className="shrink-0 text-rouge-vif">
              ↗
            </span>
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-trait decoration-1 underline-offset-4 transition-colors hover:text-encre hover:decoration-rouge-vif"
            >
              {s.titre}
            </a>
          </li>
        ))}
      </ul>
    </footer>
  );
}
