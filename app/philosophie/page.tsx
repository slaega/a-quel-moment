import type { Metadata } from "next";
import Link from "next/link";
import EnteteDePage from "@/components/EnteteDePage";
import Signature from "@/components/Signature";
import { getCas } from "@/lib/cas";
import { site } from "@/lib/site";
import { notFound } from "next/navigation";
import Gabarit from "@/components/Gabarit";

/**
 * Le manifeste de la série est un CAS comme les autres — le 014. Cette page
 * n'a donc pas de texte à elle : elle donne au 014 la place d'une page de
 * référence, atteignable depuis la navigation.
 */
const REFERENCE = "014";

export function generateMetadata(): Metadata {
  const cas = getCas(REFERENCE);
  if (!cas) return { title: "Philosophie" };

  return {
    title: cas.titre,
    description: cas.extrait ?? site.description,
    alternates: { canonical: `${site.url}/philosophie/` },
    openGraph: {
      type: "article",
      url: `${site.url}/philosophie/`,
      title: cas.extrait ?? cas.titre,
      description: `${site.nom} — la philosophie de la série`,
      images: [{ url: `/og/cas-${cas.slug}.png`, width: 1200, height: 630, alt: cas.titre }],
    },
  };
}

export default function Philosophie() {
  const cas = getCas(REFERENCE);
  if (!cas) notFound();

  return (
    <Gabarit signature={cas.signature ?? undefined}>
      <div className="mx-auto max-w-article px-6 pt-16 pb-24 md:px-10 md:pt-24">
        <EnteteDePage
          surtitre="Le manifeste"
          titre={cas.titre}
          chapo={cas.extrait ?? undefined}
        />

        <article className="border-l-2 border-rouge pl-6 md:pl-12">
          <div
            className="prose-cas max-w-lecture"
            dangerouslySetInnerHTML={{ __html: cas.corps }}
          />

          {cas.signature && (
            <div className="mt-14 max-w-lecture border-t border-trait pt-10">
              <Signature texte={cas.signature} taille="grande" />
            </div>
          )}
        </article>

        <div className="mt-20 flex flex-col gap-4 border-t border-trait pt-10 text-sm sm:flex-row sm:justify-between">
          <Link
            href={`/cas/${cas.slug}/`}
            className="text-discret transition-colors hover:text-encre"
          >
            Ce texte est le CAS {cas.slug} — le lire dans l&apos;archive, et le copier
          </Link>
          <Link
            href="/cas/"
            className="shrink-0 border-b border-rouge pb-1 text-encre transition-colors hover:text-rouge-vif"
          >
            Tous les CAS
          </Link>
        </div>
      </div>
    </Gabarit>
  );
}
