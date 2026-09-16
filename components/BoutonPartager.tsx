"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Partage natif quand le navigateur le propose — c'est le cas sur les
 * téléphones, d'où ces textes sont lus et republiés : la feuille de partage
 * du système ouvre directement WhatsApp, les messages, le reste.
 *
 * Ailleurs (la plupart des navigateurs de bureau), on copie le lien : c'est le
 * geste équivalent, et l'aperçu au partage fera le reste.
 */
export default function BoutonPartager({ titre }: { titre: string }) {
  const [etat, setEtat] = useState<"repos" | "copie" | "echec">("repos");
  const [natif, setNatif] = useState(false);
  const minuteur = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setNatif(typeof navigator !== "undefined" && typeof navigator.share === "function");
    return () => {
      if (minuteur.current) clearTimeout(minuteur.current);
    };
  }, []);

  function signaler(resultat: "copie" | "echec") {
    setEtat(resultat);
    if (minuteur.current) clearTimeout(minuteur.current);
    minuteur.current = setTimeout(() => setEtat("repos"), 2400);
  }

  async function partager() {
    const url = window.location.href;

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: titre, url });
        return;
      } catch (err) {
        // Feuille de partage refermée sans choisir : ce n'est pas un échec.
        if (err instanceof DOMException && err.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      signaler("copie");
    } catch {
      signaler("echec");
    }
  }

  const libelle = {
    repos: natif ? "Partager" : "Copier le lien",
    copie: "Lien copié",
    echec: "Copie impossible",
  }[etat];

  return (
    <button
      type="button"
      onClick={partager}
      className="group inline-flex items-center gap-2.5 border border-trait px-4 py-2.5 text-sm text-encre transition-colors hover:border-rouge hover:text-rouge-vif"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-4 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3v13M12 3 8 7M12 3l4 4M5 14v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5" />
      </svg>
      {libelle}
      <span aria-live="polite" className="sr-only">
        {etat === "copie" ? "Le lien a été copié dans le presse-papiers." : ""}
      </span>
    </button>
  );
}
