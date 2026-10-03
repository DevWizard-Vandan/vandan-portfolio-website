import { projects } from "@/lib/projects";
export default function sitemap() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://vandan-portfolio-website.vercel.app";

  return [
    "",
    "/work",
    "/research",
    "/about",
    ...projects.map((p) => `/work/${p.slug}`),
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: path ? 0.8 : 1,
  }));
}
