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
      <div className="gouttiere mx-auto max-w-article pt-10 pb-20 md:pt-16 md:pb-28">
        <EnteteDePage
          surtitre="Le manifeste"
          titre={cas.titre}
          chapo={cas.extrait ?? undefined}
        />

        <article className="md:border-l-2 md:border-rouge md:pl-12">
          <div
            className="prose-cas max-w-lecture"
            dangerouslySetInnerHTML={{ __html: cas.corps }}
          />

          {cas.signature && (
            <div className="mt-16 max-w-lecture md:mt-20">
              <Signature texte={cas.signature} />
            </div>
          )}
        </article>

        <div className="mt-16 flex flex-col gap-2 border-t border-trait pt-8 sm:flex-row sm:items-center sm:justify-between md:mt-24">
          <Link
            href={`/cas/${cas.slug}/`}
            className="surtitre lien-sobre cible text-discret hover:text-encre"
          >
            Ce texte est le CAS {cas.slug} — le lire dans l&apos;archive, et le copier
          </Link>
          <Link
            href="/cas/"
            className="surtitre lien-sobre cible shrink-0 text-seconde"
          >
            Tous les CAS
          </Link>
        </div>
      </div>
    </Gabarit>
  );
}
