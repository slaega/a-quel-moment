"use client";

import { CLE_THEME } from "@/lib/theme";

/** Le thème réellement appliqué, choix explicite ou préférence système. */
function themeActuel(): "clair" | "sombre" {
  if (document.documentElement.dataset.theme === "dark") return "sombre";
  if (document.documentElement.dataset.theme === "light") return "clair";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "sombre" : "clair";
}

export default function BasculeTheme() {
  function basculer() {
    const vers = themeActuel() === "sombre" ? "light" : "dark";
    document.documentElement.dataset.theme = vers;
    try {
      localStorage.setItem(CLE_THEME, vers);
    } catch {
      // Navigation privée ou stockage refusé : le thème tient pour la visite.
    }
  }

  return (
    <button
      type="button"
      onClick={basculer}
      aria-label="Changer de thème"
      title="Changer de thème"
      className="-m-2 p-2 text-discret transition-colors hover:text-encre"
    >
      {/* Lune : affichée en thème clair, elle annonce le passage au sombre. */}
      <svg
        className="si-clair size-[18px]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.6 6.6 0 0 0 10.5 10.5Z" />
      </svg>

      {/* Soleil : affiché en thème sombre. */}
      <svg
        className="si-sombre size-[18px]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" />
      </svg>
    </button>
  );
}
