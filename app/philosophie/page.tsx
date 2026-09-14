import type { Metadata } from "next";
import Link from "next/link";
import EnteteDePage from "@/components/EnteteDePage";
import NumeroCas from "@/components/NumeroCas";
import Signature from "@/components/Signature";
import { formaterDate, getCas } from "@/lib/cas";
import { getPage } from "@/lib/pages";

const page = getPage("philosophie");

// Le CAS #014 est le texte de référence : la philosophie derrière le format.
const REFERENCE = "014";

export const metadata: Metadata = {
  title: page.titre,
  description: page.description,
};

export default function Philosophie() {
  const reference = getCas(REFERENCE);

  return (
    <div className="mx-auto max-w-page px-6 pt-16 pb-24 md:px-10 md:pt-24">
      <EnteteDePage surtitre="Le manifeste" titre={page.titre} chapo={page.chapo} />

      <div
        className="prose-cas max-w-lecture"
        dangerouslySetInnerHTML={{ __html: page.corps }}
      />

      {reference && (
        <section className="mt-24 border-t border-trait pt-16 md:mt-32">
          <p className="surtitre mb-10 text-cendre">Le texte de référence</p>

          <article className="border-l-2 border-rouge pl-6 md:pl-12">
            <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
              <NumeroCas slug={reference.slug} />
              <time dateTime={reference.date} className="text-sm text-cendre">
                {formaterDate(reference.date)}
              </time>
            </div>

            <h2 className="titre-affiche mt-6 max-w-3xl text-3xl md:text-4xl">
              {reference.titre}
            </h2>

            <div
              className="prose-cas mt-10 max-w-lecture"
              dangerouslySetInnerHTML={{ __html: reference.corps }}
            />

            {reference.signature && (
              <div className="mt-12 max-w-lecture border-t border-trait pt-10">
                <Signature texte={reference.signature} taille="grande" />
              </div>
            )}
          </article>
        </section>
      )}

      <section className="mt-24 border-t border-trait pt-16 md:mt-32">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <h2 className="titre-affiche max-w-lecture text-3xl md:text-4xl">
            Le réflexe s&apos;attrape. Commencez par un seul fait.
          </h2>
          <Link
            href="/cas/"
            className="shrink-0 border-b border-rouge pb-1 text-sm text-craie transition-colors hover:text-rouge-vif"
          >
            Lire les CAS publiés
          </Link>
        </div>
      </section>
    </div>
  );
}
