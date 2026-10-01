import Link from "next/link";
import CarteCas from "@/components/CarteCas";
import DonneesStructurees from "@/components/DonneesStructurees";
import Gabarit from "@/components/Gabarit";
import LigneCas from "@/components/LigneCas";
import { formaterDate, getTousLesCas } from "@/lib/cas";
import { schemaSite } from "@/lib/schema";
import { site } from "@/lib/site";

/** Combien de textes le sommaire de la une montre, sous le dernier paru. */
const AU_SOMMAIRE = 6;

export default function Accueil() {
  const tous = getTousLesCas();
  const [dernier, ...precedents] = tous;
  const sommaire = precedents.slice(0, AU_SOMMAIRE);

  return (
    <Gabarit>
      <DonneesStructurees schema={schemaSite()} />

      {/*
        La une. Composition asymétrique : la question est alignée à gauche et
        occupe la largeur, le repère de série se range à droite. Un titre
        centré au milieu d'un écran vide ne dit rien du contenu — ici la
        question est le contenu, et le premier CAS suit immédiatement.
      */}
      <section className="gouttiere mx-auto max-w-page pt-10 pb-14 md:pt-16 md:pb-20">
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
          <p className="surtitre text-discret">Une série signée {site.auteur}</p>
          <p className="surtitre chiffres text-seconde">
            {tous.length} CAS publiés
          </p>
        </div>

        <h1 className="manchette mt-9 max-w-[16ch] text-manchette md:mt-14">
          À quel moment avons-nous trouvé ça <em className="italic">normal</em>
          <span className="text-rouge not-italic"> ?</span>
        </h1>

        <p className="mt-9 max-w-lecture font-serif text-chapo text-encre/75 md:mt-12">
          Des textes courts qui partent d&apos;un fait réel — pas d&apos;une opinion, pas
          d&apos;une théorie. Une scène que tout le monde a déjà vue, et devant laquelle
          tout le monde s&apos;est tu.
        </p>
      </section>

      {/* Le dernier paru, en une. */}
      {dernier && (
        <section
          aria-labelledby="dernier-paru"
          className="gouttiere mx-auto max-w-page border-t border-trait py-14 md:py-20"
        >
          <h2 id="dernier-paru" className="surtitre filet-sommaire mb-10 text-discret md:mb-14">
            Le dernier paru
          </h2>
          <CarteCas cas={dernier} />
        </section>
      )}

      {/* Le sommaire : les textes précédents, en index de revue. */}
      {sommaire.length > 0 && (
        <section
          aria-labelledby="sommaire"
          className="gouttiere mx-auto max-w-page border-t border-trait py-14 md:py-20"
        >
          <h2 id="sommaire" className="surtitre filet-sommaire mb-6 text-discret md:mb-10">
            Dans la série
          </h2>

          <ul className="border-t border-trait">
            {sommaire.map((c) => (
              <LigneCas
                key={c.slug}
                cas={{
                  slug: c.slug,
                  titre: c.titre,
                  categorie: c.categorie,
                  extrait: c.extrait,
                  dateIso: c.date,
                  dateLisible: formaterDate(c.date),
                }}
              />
            ))}
          </ul>

          <Link
            href="/cas/"
            className="group cible mt-8 items-baseline gap-3 text-encre"
          >
            <span className="manchette text-section">
              Voir les {tous.length} CAS
            </span>
            <span
              aria-hidden="true"
              className="inline-block h-px w-10 translate-y-[-0.35em] bg-rouge transition-[width] duration-200 group-hover:w-16"
            />
          </Link>
        </section>
      )}

      {/* Le principe, en fin de une — un colophon, pas une page d'accueil. */}
      <section
        aria-labelledby="principe"
        className="gouttiere mx-auto max-w-page border-t border-trait py-14 md:py-20"
      >
        <div className="grid gap-y-8 md:grid-cols-[12rem_1fr] md:gap-x-16">
          <h2 id="principe" className="surtitre text-discret md:pt-2">
            Le principe
          </h2>

          <div className="max-w-lecture">
            <div className="space-y-6 font-serif text-chapo text-encre/85">
              <p>
                Chaque CAS part d&apos;un fait réel. On le raconte en quelques lignes,
                sans commentaire.
              </p>
              <p>
                On montre ensuite ce qu&apos;il nous a fait accepter — la chose
                qu&apos;on a laissée devenir normale sans jamais l&apos;avoir décidée.
              </p>
              <p>Puis on pose la seule question qui reste. Toujours la même.</p>
            </div>

            <Link
              href="/philosophie/"
              className="surtitre lien-sobre cible mt-7 text-seconde"
            >
              La philosophie de la série
            </Link>
          </div>
        </div>
      </section>
    </Gabarit>
  );
}
