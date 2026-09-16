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
      <div className="mx-auto max-w-page px-6 pt-16 pb-24 md:px-10 md:pt-24">
        <EnteteDePage surtitre={site.auteur} titre={page.titre} chapo={page.chapo} />

        <div
          className="prose-cas max-w-lecture"
          dangerouslySetInnerHTML={{ __html: page.corps }}
        />

        <p className="mt-20 border-t border-trait pt-10">
          <Link
            href="/cas/"
            className="border-b border-rouge pb-1 text-sm text-encre transition-colors hover:text-rouge-vif"
          >
            Lire les CAS
          </Link>
        </p>
      </div>
    </Gabarit>
  );
}
