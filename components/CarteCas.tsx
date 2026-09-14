import Link from "next/link";
import NumeroCas from "@/components/NumeroCas";
import Signature from "@/components/Signature";
import { formaterDate, type Cas } from "@/lib/cas";

/** Le CAS mis en avant : mise en page d'affiche, bande rouge à gauche. */
export default function CarteCas({ cas }: { cas: Cas }) {
  return (
    <article className="border-l-2 border-rouge pl-6 md:pl-10">
      <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
        <NumeroCas slug={cas.slug} />
        <span className="surtitre text-cendre">{cas.categorie}</span>
        <time dateTime={cas.date} className="text-sm text-cendre">
          {formaterDate(cas.date)}
        </time>
      </div>

      <h3 className="titre-affiche mt-6 text-3xl md:text-[2.75rem]">
        <Link href={`/cas/${cas.slug}/`} className="transition-colors hover:text-rouge-vif">
          {cas.titre}
        </Link>
      </h3>

      <p className="mt-6 max-w-lecture text-lg leading-relaxed text-craie/75">{cas.extrait}</p>

      <div className="mt-10">
        <Signature texte={cas.signature ?? undefined} />
      </div>

      <Link
        href={`/cas/${cas.slug}/`}
        className="mt-8 inline-block border-b border-rouge pb-1 text-sm text-craie transition-colors hover:text-rouge-vif"
      >
        Lire le CAS {cas.slug}
      </Link>
    </article>
  );
}
