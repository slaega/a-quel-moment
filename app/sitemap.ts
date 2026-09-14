import type { MetadataRoute } from "next";
import { getTousLesCas } from "@/lib/cas";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const fixes = ["", "/cas/", "/philosophie/", "/a-propos/"].map((chemin) => ({
    url: `${site.url}/${chemin.replace(/^\//, "")}`,
    changeFrequency: "weekly" as const,
  }));

  const cas = getTousLesCas().map((c) => ({
    url: `${site.url}/cas/${c.slug}/`,
    lastModified: c.date,
    changeFrequency: "yearly" as const,
  }));

  return [...fixes, ...cas];
}
