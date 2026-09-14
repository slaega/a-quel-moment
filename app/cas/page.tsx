import type { Metadata } from "next";
import ArchiveCas, { type EntreeCas } from "@/components/ArchiveCas";
import { formaterDate, getCategories, getTousLesCas } from "@/lib/cas";

export const metadata: Metadata = {
  title: "Les CAS",
  description:
    "L'archive complète de la série : chaque CAS part d'un fait réel et se termine par la même question.",
};

export default function Archive() {
  const entrees: EntreeCas[] = getTousLesCas().map((c) => ({
    slug: c.slug,
    titre: c.titre,
    categorie: c.categorie,
    extrait: c.extrait,
    dateIso: c.date,
    dateLisible: formaterDate(c.date),
  }));

  return (
    <div className="mx-auto max-w-page px-6 pt-16 pb-24 md:px-10 md:pt-24">
      <header className="mb-12 md:mb-16">
        <h1 className="titre-affiche text-4xl md:text-6xl">Les CAS</h1>
        <p className="mt-6 max-w-lecture text-lg leading-relaxed text-discret">
          Tous les textes publiés, du plus récent au premier. Chacun part d&apos;un fait
          réel et s&apos;arrête là où la question commence.
        </p>
      </header>

      <ArchiveCas entrees={entrees} categories={getCategories()} />
    </div>
  );
}
