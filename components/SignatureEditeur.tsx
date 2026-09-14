import LogoSlaega from "@/components/LogoSlaega";
import type { Logo } from "@/lib/logo";
import { site } from "@/lib/site";

/** « Une série signée Slaega » — la marque de l'éditeur, pas celle du site. */
export default function SignatureEditeur({
  prefixe,
  logo,
}: {
  prefixe: string;
  logo: Logo | null;
}) {
  return (
    <a
      href={site.editeurUrl}
      target="_blank"
      rel="noreferrer"
      className="group inline-flex items-center gap-2.5 text-discret transition-colors hover:text-encre"
    >
      <span>{prefixe}</span>
      <LogoSlaega logo={logo} hauteur={20} />
    </a>
  );
}
