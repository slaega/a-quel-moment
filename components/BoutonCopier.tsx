"use client";

import { useEffect, useRef, useState } from "react";

export default function BoutonCopier({ texte }: { texte: string }) {
  const [etat, setEtat] = useState<"repos" | "copie" | "echec">("repos");
  const minuteur = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (minuteur.current) clearTimeout(minuteur.current);
    };
  }, []);

  async function copier() {
    try {
      await navigator.clipboard.writeText(texte);
      setEtat("copie");
    } catch {
      setEtat("echec");
    }
    if (minuteur.current) clearTimeout(minuteur.current);
    minuteur.current = setTimeout(() => setEtat("repos"), 2400);
  }

  const libelle = {
    repos: "Copier le texte",
    copie: "Texte copié",
    echec: "Copie impossible",
  }[etat];

  return (
    <button
      type="button"
      onClick={copier}
      className="surtitre group inline-flex min-h-11 items-center gap-2.5 rounded-full border border-trait px-5 text-encre transition-colors hover:border-seconde hover:text-seconde"
    >
      <span
        aria-hidden="true"
        className={
          etat === "copie"
            ? "size-1.5 rounded-full bg-seconde"
            : "size-1.5 rounded-full bg-discret transition-colors group-hover:bg-seconde"
        }
      />
      {libelle}
      <span aria-live="polite" className="sr-only">
        {etat === "copie" ? "Le texte a été copié dans le presse-papiers." : ""}
      </span>
    </button>
  );
}
