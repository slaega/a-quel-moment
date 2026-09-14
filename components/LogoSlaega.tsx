import type { Logo } from "@/lib/logo";

/**
 * La marque Slaega, déclinée pour les deux thèmes.
 *
 * Quand la variante pour fond sombre existe, les deux images sont posées et
 * c'est le CSS qui montre la bonne (voir .si-clair / .si-sombre dans
 * app/globals.css). Le serveur ne peut pas savoir quel thème la personne
 * utilise : trancher en JavaScript provoquerait un écart d'hydratation et un
 * clignotement.
 *
 * Sans fichier de logo, on retombe sur un logotype typographique provisoire.
 */
export default function LogoSlaega({
  logo,
  hauteur,
}: {
  logo: Logo | null;
  /** Hauteur de rendu en pixels ; la largeur suit le ratio du fichier. */
  hauteur: number;
}) {
  if (logo) {
    const largeur = Math.round((logo.largeur / logo.hauteur) * hauteur);
    const taille = { width: largeur, height: hauteur };

    /* eslint-disable @next/next/no-img-element -- export statique :
       l'optimiseur d'images de Next n'y tourne pas. */
    if (!logo.srcSurSombre) {
      return <img src={logo.src} alt="Slaega" {...taille} style={taille} />;
    }

    return (
      <>
        <img src={logo.src} alt="Slaega" className="si-clair" {...taille} style={taille} />
        <img
          src={logo.srcSurSombre}
          alt=""
          aria-hidden="true"
          className="si-sombre"
          {...taille}
          style={taille}
        />
      </>
    );
    /* eslint-enable @next/next/no-img-element */
  }

  return (
    <svg
      viewBox="0 0 108 22"
      style={{ height: hauteur, width: "auto" }}
      role="img"
      aria-label="Slaega"
      fill="currentColor"
    >
      <text
        x="0"
        y="16"
        fontFamily="var(--font-inter), system-ui, sans-serif"
        fontSize="15"
        fontWeight="600"
        letterSpacing="2.6"
      >
        SLAEGA
      </text>
    </svg>
  );
}
