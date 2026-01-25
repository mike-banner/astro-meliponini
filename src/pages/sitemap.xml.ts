import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const pages = [
    "/",
    "/products",
    "/products/miel",
    "/products/bougie",
  ];

  const urls = pages
    .map(
      (p) => `
  <url>
    <loc>https://ton-domaine.pages.dev${p}</loc>
  </url>`
    )
    .join("");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`,
    {
      headers: { "Content-Type": "application/xml" },
    }
  );
};
