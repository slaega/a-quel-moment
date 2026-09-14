import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BoutonCopier from "@/components/BoutonCopier";
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
  const url = `${site.url}/cas/${cas.slug}/`;
  return {
    title: cas.titre,
    description: cas.extrait,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: cas.extrait,
      description: `CAS ${cas.slug} · ${cas.titre} — ${site.nom}`,
      publishedTime: cas.date,
    },
    twitter: {
      card: "summary_large_image",
      title: cas.extrait,
      description: `CAS ${cas.slug} · ${cas.titre}`,
    },
  };
}

export default async function PageCas({ params }: { params: Promise<Params> }) {
  const { numero } = await params;
  const cas = getCas(numero);
  if (!cas) notFound();

  const { precedent, suivant } = getVoisins(cas.slug);

  return (
    <div className="mx-auto max-w-page px-6 pt-12 pb-24 md:px-10 md:pt-20">
      <Link
        href="/cas/"
        className="text-sm text-cendre transition-colors hover:text-craie"
      >
        ← Tous les CAS
      </Link>

      {/* Mise en page d'affiche : bande rouge à gauche, texte aligné à gauche. */}
      <article className="mt-10 border-l-2 border-rouge pl-6 md:mt-14 md:pl-12">
        <header>
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
            <NumeroCas slug={cas.slug} taille="grande" />
            <span className="surtitre text-cendre">{cas.categorie}</span>
            <time dateTime={cas.date} className="text-sm text-cendre">
              {formaterDate(cas.date)}
            </time>
          </div>

          <h1 className="titre-affiche mt-7 max-w-3xl text-[2rem] md:text-5xl">
            {cas.titre}
          </h1>
        </header>

        {cas.brouillon && (
          <p className="mt-10 max-w-lecture border border-trait px-4 py-3 text-sm text-cendre">
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

        <div className="mt-12">
          <BoutonCopier texte={cas.texteBrut} />
        </div>
      </article>

      <nav
        aria-label="CAS précédent et suivant"
        className="mt-20 grid gap-px border-t border-trait pt-10 sm:grid-cols-2 sm:gap-8"
      >
        {precedent ? (
          <Link href={`/cas/${precedent.slug}/`} className="group py-4">
            <span className="surtitre text-cendre">CAS précédent</span>
            <span className="mt-3 block text-lg font-medium tracking-tight text-craie transition-colors group-hover:text-rouge-vif">
              {precedent.slug} · {precedent.titre}
            </span>
          </Link>
        ) : (
          <span />
        )}

        {suivant && (
          <Link href={`/cas/${suivant.slug}/`} className="group py-4 sm:text-right">
            <span className="surtitre text-cendre">CAS suivant</span>
            <span className="mt-3 block text-lg font-medium tracking-tight text-craie transition-colors group-hover:text-rouge-vif">
              {suivant.slug} · {suivant.titre}
            </span>
          </Link>
        )}
      </nav>
    </div>
  );
}
