import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BoutonCopier from "@/components/BoutonCopier";
import BoutonPartager from "@/components/BoutonPartager";
import NumeroCas from "@/components/NumeroCas";
import Signature from "@/components/Signature";
import { formaterDate, getCas, getTousLesCas, getVoisins } from "@/lib/cas";
import { site } from "@/lib/site";

type Params = { numero: string };

export function generateStaticParams(): Params[] {
  return getTousLesCas().map((c) => ({ numero: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { numero } = await params;
  const cas = getCas(numero);
  if (!cas) return {};

  // L'extrait sert de titre au partage : c'est lui qui accroche dans un fil.
  // L'affiche est générée au build par scripts/generer-og.mjs.
  const url = `${site.url}/cas/${cas.slug}/`;
  const affiche = `/og/cas-${cas.slug}.png`;
  const accroche = cas.extrait ?? cas.titre;
  return {
    title: cas.titre,
    description: accroche,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: accroche,
      description: `CAS ${cas.slug} — ${site.nom}`,
      ...(cas.date ? { publishedTime: cas.date } : {}),
      images: [{ url: affiche, width: 1200, height: 630, alt: cas.titre }],
    },
    twitter: {
      card: "summary_large_image",
      title: accroche,
      description: `CAS ${cas.slug} — ${site.nom}`,
      images: [affiche],
    },
  };
}

export default async function PageCas({ params }: { params: Promise<Params> }) {
  const { numero } = await params;
  const cas = getCas(numero);
  if (!cas) notFound();

  const { precedent, suivant } = getVoisins(cas.slug);
  const date = formaterDate(cas.date);

  return (
    <div className="mx-auto max-w-page px-6 pt-12 pb-24 md:px-10 md:pt-20">
      <Link
        href="/cas/"
        className="text-sm text-discret transition-colors hover:text-encre"
      >
        ← Tous les CAS
      </Link>

      {/* Mise en page d'affiche : bande rouge à gauche, texte aligné à gauche. */}
      <article className="mt-10 border-l-2 border-rouge pl-6 md:mt-14 md:pl-12">
        <header>
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
            <NumeroCas slug={cas.slug} taille="grande" />
            {cas.categorie && <span className="surtitre text-discret">{cas.categorie}</span>}
            {date && cas.date && (
              <time dateTime={cas.date} className="text-sm text-discret">
                {date}
              </time>
            )}
          </div>

          <h1 className="titre-affiche mt-7 max-w-3xl text-[2rem] md:text-5xl">
            {cas.titre}
          </h1>
        </header>

        {cas.brouillon && (
          <p className="mt-10 max-w-lecture border border-trait px-4 py-3 text-sm text-discret">
            Brouillon — ce texte attend sa version publiée.
          </p>
        )}

        <div
          className="prose-cas mt-12 max-w-lecture md:mt-14"
          dangerouslySetInnerHTML={{ __html: cas.corps }}
        />

        {cas.signature && (
          <div className="mt-14 max-w-lecture border-t border-trait pt-10">
            <Signature texte={cas.signature} taille="grande" />
          </div>
        )}

        <div className="mt-12 flex flex-wrap gap-3">
          <BoutonCopier texte={cas.texteBrut} />
          <BoutonPartager titre={`CAS ${cas.slug} — ${cas.titre}`} />
        </div>
      </article>

      <nav
        aria-label="CAS précédent et suivant"
        className="mt-20 grid gap-px border-t border-trait pt-10 sm:grid-cols-2 sm:gap-8"
      >
        {precedent ? (
          <Link href={`/cas/${precedent.slug}/`} className="group py-4">
            <span className="surtitre text-discret">CAS précédent</span>
            <span className="mt-3 block text-lg font-medium tracking-tight text-encre transition-colors group-hover:text-rouge-vif">
              {precedent.slug} · {precedent.titre}
            </span>
          </Link>
        ) : (
          <span />
        )}

        {suivant && (
          <Link href={`/cas/${suivant.slug}/`} className="group py-4 sm:text-right">
            <span className="surtitre text-discret">CAS suivant</span>
            <span className="mt-3 block text-lg font-medium tracking-tight text-encre transition-colors group-hover:text-rouge-vif">
              {suivant.slug} · {suivant.titre}
            </span>
          </Link>
        )}
      </nav>
    </div>
  );
}
