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
    changeFrequency: "yearly" as const,
    ...(c.date ? { lastModified: c.date } : {}),
  }));

  return [...fixes, ...cas];
}
