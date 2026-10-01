import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BoutonCopier from "@/components/BoutonCopier";
import BoutonPartager from "@/components/BoutonPartager";
import DonneesStructurees from "@/components/DonneesStructurees";
import EtiquetteCategorie from "@/components/EtiquetteCategorie";
import Gabarit from "@/components/Gabarit";
import Sources from "@/components/Sources";
import {
  formaterDate,
  getCas,
  getRecommandations,
  getTousLesCas,
  getVoisins,
  type Cas,
} from "@/lib/cas";
import { schemaCas } from "@/lib/schema";
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
      ...(cas.revision ? { modifiedTime: cas.revision } : {}),
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
  const aLireEnsuite = getRecommandations(cas.slug);
  const date = formaterDate(cas.date);

  return (
    <Gabarit signature={cas.signature ?? undefined}>
      <DonneesStructurees schema={schemaCas(cas)} />

      <div className="gouttiere mx-auto max-w-article pt-6 pb-16 md:pt-10 md:pb-24">
        {/*
          Masqué sur téléphone : le bandeau porte déjà « Les CAS » quarante
          pixels plus haut. Deux liens vers la même page, l'un sous l'autre,
          ne sont pas une commodité.
        */}
        <Link
          href="/cas/"
          className="surtitre lien-sobre cible hidden text-discret hover:text-encre sm:inline-flex"
        >
          ← Tous les CAS
        </Link>

        {/*
          Le filet rouge de la série. Vertical sur grand écran, où il tient
          l'article ; horizontal sur téléphone, où une bande à gauche
          mangerait la largeur de lecture sans rien tenir.
        */}
        <article className="mt-6 sm:mt-10 md:mt-16 md:border-l-2 md:border-rouge md:pl-12">
          <header>
            <span aria-hidden="true" className="block h-0.5 w-10 bg-rouge md:hidden" />

            {/*
              Le numéro sur sa ligne, la catégorie et la date sur la suivante.
              Alignés sur une même ligne de base, un chiffre de 36 px et une
              étiquette de 13 px se décalaient l'un par rapport à l'autre, et
              la date retombait seule sur un troisième rang.
            */}
            <div className="mt-5 md:mt-0">
              <span className="numero block text-4xl text-rouge md:text-5xl">
                {cas.slug}
              </span>

              <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-2 md:mt-4">
                {cas.categorie && <EtiquetteCategorie nom={cas.categorie} />}
                {date && cas.date && (
                  <time dateTime={cas.date} className="chiffres text-meta text-discret">
                    {date}
                  </time>
                )}
              </div>
            </div>

            <h1 className="manchette mt-8 max-w-[18ch] text-manchette-2 md:mt-10">
              {cas.titre}
            </h1>

            {/* Une introduction, seulement quand elle existe vraiment. */}
            {cas.chapo && (
              <p className="mt-8 max-w-lecture font-serif text-chapo text-encre/80">
                {cas.chapo}
              </p>
            )}

            {cas.contribution && (
              <p className="mt-7 flex max-w-lecture items-baseline gap-2.5 text-meta text-discret">
                <span aria-hidden="true" className="shrink-0 text-seconde">
                  ↳
                </span>
                {cas.contribution}
              </p>
            )}
          </header>

          {cas.brouillon && (
            <p className="mt-10 max-w-lecture border border-trait px-4 py-3 text-meta text-discret">
              Brouillon — ce texte attend sa version publiée.
            </p>
          )}

          <div
            className="prose-cas mt-12 max-w-lecture md:mt-16"
            dangerouslySetInnerHTML={{ __html: cas.corps }}
          />

          {/*
            La question. Elle est le point d'arrivée de tout le texte : elle a
            donc son propre mouvement, son filet, et la plus grande taille de
            la page après le titre.
          */}
          {cas.signature && (
            <div className="mt-16 max-w-lecture md:mt-20">
              <span aria-hidden="true" className="block h-px w-16 bg-rouge" />
              <p className="mt-8 font-serif text-question leading-(--text-question--line-height) text-encre italic">
                {cas.signature}
              </p>
            </div>
          )}

          <Sources sources={cas.sources} />

          <div className="mt-14 flex flex-wrap gap-3">
            <BoutonCopier texte={cas.texteBrut} />
            <BoutonPartager titre={`CAS ${cas.slug} — ${cas.titre}`} />
          </div>
        </article>

        {/* Le texte d'avant et celui d'après, dans l'ordre de la série. */}
        <nav
          aria-label="CAS précédent et suivant"
          className="mt-20 grid gap-px border-t border-trait sm:grid-cols-2 sm:gap-10 md:mt-28"
        >
          {precedent ? (
            <Voisin cas={precedent} sens="Précédent" />
          ) : (
            <span className="hidden sm:block" />
          )}
          {suivant && <Voisin cas={suivant} sens="Suivant" aligneADroite />}
        </nav>

        {/* Recommandations : même catégorie d'abord, voisins exclus. */}
        {aLireEnsuite.length > 0 && (
          <section
            aria-labelledby="a-lire"
            className="mt-16 border-t border-trait pt-10 md:mt-24"
          >
            <h2 id="a-lire" className="surtitre filet-sommaire mb-8 text-discret">
              À lire ensuite
            </h2>
            <ul className="grid gap-x-12 gap-y-8 sm:grid-cols-2">
              {aLireEnsuite.map((c) => (
                <li key={c.slug}>
                  <Link href={`/cas/${c.slug}/`} className="group block">
                    <span className="flex items-baseline gap-3">
                      <span className="numero text-lg text-rouge">{c.slug}</span>
                      {/* Pas d'étiquette cliquable ici : elle serait
                          imbriquée dans le lien du CAS. */}
                      {c.categorie && (
                        <span className="surtitre text-seconde">{c.categorie}</span>
                      )}
                    </span>
                    <span className="manchette mt-3 block text-section text-encre decoration-rouge decoration-1 underline-offset-[0.16em] group-hover:underline">
                      {c.titre}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </Gabarit>
  );
}

function Voisin({
  cas,
  sens,
  aligneADroite = false,
}: {
  cas: Pick<Cas, "slug" | "titre">;
  sens: string;
  aligneADroite?: boolean;
}) {
  return (
    <Link
      href={`/cas/${cas.slug}/`}
      className={"group block py-7 " + (aligneADroite ? "sm:text-right" : "")}
    >
      <span className="surtitre text-discret">{sens}</span>
      <span className="manchette mt-3 flex items-baseline gap-3 text-section text-encre decoration-rouge decoration-1 underline-offset-[0.16em] group-hover:underline">
        {!aligneADroite && <span className="chiffres text-rouge">{cas.slug}</span>}
        <span className={aligneADroite ? "ml-auto" : ""}>{cas.titre}</span>
        {aligneADroite && <span className="chiffres text-rouge">{cas.slug}</span>}
      </span>
    </Link>
  );
}
