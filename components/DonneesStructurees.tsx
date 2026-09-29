/**
 * Données structurées JSON-LD.
 *
 * Sans elles, Google doit deviner qu'un CAS est un texte daté, signé, membre
 * d'une série — il n'a que du HTML sobre et quelques balises Open Graph, qui
 * servent aux réseaux sociaux et pas à l'indexation. Le schéma dit
 * explicitement ce qu'est la page, quand elle a paru et à quoi elle
 * appartient ; sur /cas/, il énumère les URLs, ce qui donne au robot un
 * second chemin de découverte que le seul maillage interne.
 */
export default function DonneesStructurees({ schema }: { schema: object }) {
  return (
    <script
      type="application/ld+json"
      // Le contenu vient de nos fichiers, jamais d'une saisie extérieure.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
      }}
    />
  );
}
