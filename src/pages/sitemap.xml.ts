import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
    const site = "https://ton-domaine.pages.dev";

    const res = await fetch(
        `${import.meta.env.WC_API_URL}/wp-json/wc/v3/products` +
        `?consumer_key=${import.meta.env.WC_CONSUMER_KEY}` +
        `&consumer_secret=${import.meta.env.WC_CONSUMER_SECRET}` +
        `&per_page=100`
    );

    const products = await res.json();

    const urls = products.map((product: any) => {
        return `
      <url>
        <loc>${site}/product/${product.slug}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>
    `;
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>${site}/</loc>
      <changefreq>weekly</changefreq>
      <priority>1.0</priority>
    </url>
    ${urls.join("")}
  </urlset>`;

    return new Response(xml, {
        headers: {
            "Content-Type": "application/xml",
        },
    });
};
