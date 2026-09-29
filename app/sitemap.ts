import type { MetadataRoute } from "next";
import { getTousLesCas } from "@/lib/cas";
import { laPlusRecente, revisionDuFichier, revisionDuGabarit } from "@/lib/revision";
import { site } from "@/lib/site";

export const dynamic = "force-static";

/**
 * Le sitemap ne porte que ce que Google lit : l'URL et « lastmod ».
 *
 * « changefreq » et « priority » sont ignorés depuis des années ; pire, le
 * changefreq « yearly » posé sur les CAS invitait les autres robots à ne
 * plus repasser. Ils sont retirés.
 *
 * « lastmod » n'est utile que s'il est exact : Google cesse de le lire sur
 * tout le fichier dès qu'il le prend en défaut. D'où lib/revision.ts, qui
 * date les pages sur l'historique git plutôt que sur la date du texte — et
 * d'où le fait que chaque page fixe porte sa propre date, au lieu de
 * partager celle de la dernière publication.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const cas = getTousLesCas();
  const gabarit = revisionDuGabarit();

  // L'accueil et l'archive sont réécrits à chaque parution ; les deux pages
  // de texte ne bougent que lorsqu'on les édite.
  const derniereParution = laPlusRecente(...cas.map((c) => c.revision), gabarit);
  const page = (fichier: string) =>
    laPlusRecente(revisionDuFichier(fichier), gabarit) ?? derniereParution;

  const fixes: [string, string | null][] = [
    ["", derniereParution],
    ["cas/", derniereParution],
    ["philosophie/", page("app/philosophie/page.tsx")],
    ["a-propos/", page("app/a-propos/page.tsx")],
  ];

  return [
    ...fixes.map(([chemin, revision]) => ({
      url: `${site.url}/${chemin}`,
      ...(revision ? { lastModified: revision } : {}),
    })),
    ...cas.map((c) => ({
      url: `${site.url}/cas/${c.slug}/`,
      ...(c.revision ? { lastModified: c.revision } : {}),
    })),
  ];
}
