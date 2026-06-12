export default function robots() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://vandan-portfolio-website.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: "/"
    },
    sitemap: `${siteUrl}/sitemap.xml`
  };
}
