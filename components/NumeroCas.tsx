/** Le numéro d'un CAS, composé comme une référence d'affiche. */
export default function NumeroCas({
  slug,
  taille = "normale",
}: {
  slug: string;
  taille?: "normale" | "grande";
}) {
  return (
    <span
      className={
        taille === "grande"
          ? "font-semibold tracking-tight text-rouge tabular-nums text-3xl md:text-4xl"
          : "font-semibold tracking-tight text-rouge tabular-nums text-base"
      }
    >
      <span className="opacity-60">CAS </span>
      {slug}
    </span>
  );
}
