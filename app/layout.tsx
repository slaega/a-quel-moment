import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import Entete from "@/components/Entete";
import PiedDePage from "@/components/PiedDePage";
import { site } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const lora = Lora({
  subsets: ["latin"],
  style: ["italic", "normal"],
  display: "swap",
  variable: "--font-lora",
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
  },
  twitter: {
    card: "summary_large_image",
    title: site.signature,
    description: site.description,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${lora.variable}`}>
      <body className="flex min-h-screen flex-col">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-4 focus:border focus:border-rouge focus:bg-encre focus:px-4 focus:py-2"
        >
          Aller au contenu
        </a>
        <Entete />
        <main id="contenu" className="flex-1">
          {children}
        </main>
        <PiedDePage />
      </body>
    </html>
  );
}
