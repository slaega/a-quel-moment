import type { Metadata } from "next";
import { Fraunces, Inter, Newsreader } from "next/font/google";
import Entete from "@/components/Entete";
import { getLogo } from "@/lib/logo";
import { site } from "@/lib/site";
import { SCRIPT_THEME } from "@/lib/theme";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

/*
 * La serif de la série : titres, corps des CAS, question de clôture.
 *
 * Newsreader remplace Lora. Les CAS se lisent d'une traite et souvent sur
 * téléphone ; il fallait une serif de presse, dessinée pour le texte autant
 * que pour l'affiche, avec une italique qui tienne la question de clôture à
 * grande taille. C'est le seul changement d'identité de la refonte, et il
 * tient en une ligne : reprendre Lora ici suffirait à revenir en arrière.
 */
const serifEdito = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-serif-edito",
});

/*
 * La police des titres.
 *
 * Newsreader est une serif de presse : juste, et volontairement discrète.
 * Pour les manchettes, la série demandait une voix. Fraunces en a une —
 * chaleureuse, un peu tordue à dessein — sans tomber dans le contraste
 * glacé d'un Bodoni ni dans l'étroitesse d'un display de mode.
 *
 * Elle porte les titres ; Newsreader garde tout ce qui se lit comme du texte
 * (corps, chapô, question de clôture). Un œil de display fatigue sur quinze
 * paragraphes ; une serif de texte n'accroche pas en manchette.
 */
const serifTitre = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-serif-titre",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.nom} — une série signée ${site.auteur}`,
    template: `%s — ${site.nom}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: site.nom,
    title: site.signature,
    description: site.description,
    images: [{ url: "/og/defaut.png", width: 1200, height: 630, alt: site.signature }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.signature,
    description: site.description,
    images: ["/og/defaut.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const logo = getLogo();

  return (
    <html lang="fr" className={`${inter.variable} ${serifEdito.variable} ${serifTitre.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_THEME }} />
      </head>
      <body className="flex min-h-screen flex-col">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-4 focus:border focus:border-rouge focus:bg-fond focus:px-4 focus:py-2"
        >
          Aller au contenu
        </a>
        <Entete logo={logo} />
        {/* <main> et le pied de page sont rendus par components/Gabarit :
            le pied reprend la question de clôture, qui dépend de la page. */}
        {children}
      </body>
    </html>
  );
}
