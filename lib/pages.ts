import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

export interface PageStatique {
  titre: string;
  /** Chapô affiché sous le titre, en retrait. */
  chapo: string;
  /** Description des balises meta ; retombe sur le chapô si absente. */
  description: string;
  corps: string;
}

const DOSSIER = path.join(process.cwd(), "content", "pages");

/** Lit une page éditoriale : content/pages/<slug>.md */
export function getPage(slug: string): PageStatique {
  const chemin = path.join(DOSSIER, `${slug}.md`);
  const { data, content } = matter(fs.readFileSync(chemin, "utf8"));

  if (typeof data.titre !== "string" || data.titre.trim() === "") {
    throw new Error(`content/pages/${slug}.md : frontmatter « titre » manquant.`);
  }

  const chapo = typeof data.chapo === "string" ? data.chapo : "";

  return {
    titre: data.titre,
    chapo,
    description: typeof data.description === "string" ? data.description : chapo,
    corps: String(
      unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype)
        .use(rehypeStringify)
        .processSync(content),
    ),
  };
}
