import type { Metadata } from "next";
import Link from "next/link";
import EnteteDePage from "@/components/EnteteDePage";
import { getPage } from "@/lib/pages";
import { site } from "@/lib/site";
import Gabarit from "@/components/Gabarit";

const page = getPage("a-propos");

export const metadata: Metadata = {
  title: page.titre,
  description: page.description,
};

export default function APropos() {
  return (
    <Gabarit>
      <div className="gouttiere mx-auto max-w-article pt-10 pb-20 md:pt-16 md:pb-28">
        <EnteteDePage surtitre={site.auteur} titre={page.titre} chapo={page.chapo} />

        <div
          className="prose-cas max-w-lecture"
          dangerouslySetInnerHTML={{ __html: page.corps }}
        />

        <p className="mt-20 border-t border-trait pt-10">
          <Link
            href="/cas/"
            className="surtitre lien-sobre cible text-seconde"
          >
            Lire les CAS
          </Link>
        </p>
      </div>
    </Gabarit>
  );
}
