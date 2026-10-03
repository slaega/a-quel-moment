import type { Metadata } from "next";
import ArchiveCas, { type EntreeCas } from "@/components/ArchiveCas";
import DonneesStructurees from "@/components/DonneesStructurees";
import Gabarit from "@/components/Gabarit";
import { formaterDate, getCategories, getTousLesCas } from "@/lib/cas";
import { schemaArchive } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Les CAS",
  description:
    "L'archive complète de la série : chaque CAS part d'un fait réel et se ferme sur sa question.",
};

export default function Archive() {
  const cas = getTousLesCas();
  const entrees: EntreeCas[] = cas.map((c) => ({
    slug: c.slug,
    titre: c.titre,
    categorie: c.categorie,
    extrait: c.extrait,
    dateIso: c.date,
    dateLisible: formaterDate(c.date),
  }));

  const premier = cas[cas.length - 1];
  const dernier = cas[0];
  const periode =
    premier?.date && dernier?.date
      ? `${formaterDate(premier.date)} — ${formaterDate(dernier.date)}`
      : null;

  return (
    <Gabarit>
      <DonneesStructurees schema={schemaArchive(cas)} />

      <div className="gouttiere mx-auto max-w-page pt-10 pb-20 md:pt-16 md:pb-28">
        <header className="mb-12 md:mb-16">
          <p className="surtitre text-discret">L&apos;archive</p>
          <h1 className="manchette mt-7 max-w-[14ch] text-manchette-2">Les CAS</h1>
          <p className="mt-7 max-w-lecture font-serif text-chapo text-encre/75">
            Tous les textes publiés, du plus récent au premier. Chacun part d&apos;un fait
            réel et s&apos;arrête là où sa question commence.
          </p>
          {periode && (
            <p className="chiffres mt-6 text-meta text-discret">{periode}</p>
          )}
        </header>

        <ArchiveCas entrees={entrees} categories={getCategories()} />
      </div>
    </Gabarit>
  );
}
