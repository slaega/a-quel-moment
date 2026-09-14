import { site } from "@/lib/site";

/** La phrase qui clôt chaque CAS — serif italique, précédée d'un filet rouge. */
export default function Signature({
  texte = site.signature,
  taille = "normale",
}: {
  texte?: string;
  taille?: "normale" | "grande";
}) {
  return (
    <p
      className={
        taille === "grande"
          ? "font-serif text-2xl leading-snug text-encre italic md:text-[1.75rem]"
          : "font-serif text-xl leading-snug text-encre italic md:text-[1.375rem]"
      }
    >
      {texte}
    </p>
  );
}
