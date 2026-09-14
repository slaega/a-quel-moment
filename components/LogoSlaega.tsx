import type { Logo } from "@/lib/logo";

/**
 * La marque Slaega.
 *
 * Trois cas, dans cet ordre :
 *
 * 1. public/slaega-mark.png existe et la marque est monochrome — elle est
 *    teintée en `currentColor` par masque CSS, donc elle suit le thème.
 * 2. Le fichier existe et la marque est en couleurs — elle s'affiche telle
 *    quelle.
 * 3. Aucun fichier — logotype typographique provisoire.
 *
 * Voir lib/logo.ts pour poser le fichier et régler LOGO_MONOCHROME.
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

    if (logo.monochrome) {
      return (
        <span
          role="img"
          aria-label="Slaega"
          style={{
            width: largeur,
            height: hauteur,
            backgroundColor: "currentColor",
            maskImage: `url(${logo.src})`,
            WebkitMaskImage: `url(${logo.src})`,
            maskSize: "contain",
            WebkitMaskSize: "contain",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskPosition: "center",
            WebkitMaskPosition: "center",
            display: "inline-block",
          }}
        />
      );
    }

    /* eslint-disable-next-line @next/next/no-img-element -- export statique :
       l'optimiseur d'images de Next n'y tourne pas. */
    return (
      <img
        src={logo.src}
        alt="Slaega"
        width={largeur}
        height={hauteur}
        style={{ height: hauteur, width: largeur }}
      />
    );
  }

  // Provisoire, tant que le fichier n'est pas déposé.
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
