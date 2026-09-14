/**
 * Logotype Slaega — PROVISOIRE.
 *
 * Le vrai logo n'a pas pu être récupéré depuis slaega.com (domaine bloqué
 * pendant la construction du site). Pour le mettre en place, remplacer le
 * contenu du <svg> ci-dessous par celui du logo officiel, en gardant
 * `fill="currentColor"` : c'est ce qui le fait suivre le thème clair ou sombre
 * sans avoir à fournir deux fichiers.
 *
 * L'en-tête et le pied de page passent tous les deux par ici. Les affiches de
 * partage ont leur propre marque, dans scripts/generer-og.mjs — satori ne peut
 * pas lire un composant React.
 */
export default function LogoSlaega({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 108 22"
      className={className}
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
