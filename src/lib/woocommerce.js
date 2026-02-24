// src/lib/woocommerce.js

/* =========================
   CONFIG
========================= */
// On force l'usage du .env. Si c'est vide, l'app crash au build avec un message clair.
const API_URL = import.meta.env.WC_API_URL;

if (!API_URL) {
    throw new Error("ERREUR CRITIQUE: WC_API_URL n'est pas définie dans ton environnement.");
}

const API_BASE = `${API_URL.replace(/\/$/, "")}/wp-json/wc/v3`;
const CONSUMER_KEY = import.meta.env.WC_CONSUMER_KEY;
const CONSUMER_SECRET = import.meta.env.WC_CONSUMER_SECRET;

/* =========================
   AUTH HEADER (Universal)
========================= */
function authHeader() {
    // btoa est standard (Navigateur, Node 16+, Cloudflare Workers)
    // Buffer.from est risqué sur Cloudflare Pages
    const token = btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`);
    return {
        'Authorization': `Basic ${token}`,
        'Content-Type': 'application/json'
    };
}

/* =========================
   MAPPING PRODUIT
========================= */
function mapProduct(product) {
    return {
        id: product.id,
        slug: product.slug,
        name: product.name,
        displayName: product.tags?.[0]?.name || "",
        latin: product.attributes?.find(attr => attr.name === "Nom latin")?.options?.[0] || "",
        number: product.sku || "",
        price: product.price || "",
        available: (product.stock_status === "instock" || product.stock_status === "onbackorder") && !!product.price,
        // Hack de secours : si la DB WP contient encore d'anciennes URLs, on corrige à la volée
        image: product.images?.[0]?.src.replace("meliponini.remyparis.com", "dev-shop.meliponini.fr") || "/images/placeholder.png",
        excerpt: product.short_description || "",
        category: product.categories?.[0]?.slug || "",
        permalink: product.permalink || "",
    };
}

/* =========================
   TOUS LES PRODUITS
========================= */
export async function getProducts() {
    const res = await fetch(
        `${API_BASE}/products?per_page=50&status=publish`,
        { headers: authHeader() }
    );

    if (!res.ok) {
        console.error(`WC Error (products): ${res.status}`);
        return [];
    }

    const data = await res.json();
    return data.map(mapProduct);
}

/* =========================
   PRODUITS PAR CATÉGORIE
========================= */
export async function getProductsByCategory(slug) {
    /* 1️⃣ Récupérer la catégorie parente */
    const catRes = await fetch(
        `${API_BASE}/products/categories?slug=${slug}`,
        { headers: authHeader() }
    );

    if (!catRes.ok) {
        console.error(`WC Error (cat slug ${slug}): ${catRes.status}`);
        return [];
    }

    const categories = await catRes.json();
    if (!categories.length) return [];

    const parentId = categories[0].id;

    /* 2️⃣ Récupérer les sous-catégories */
    const subRes = await fetch(
        `${API_BASE}/products/categories?parent=${parentId}&per_page=50`,
        { headers: authHeader() }
    );

    const subCategories = subRes.ok ? await subRes.json() : [];

    const categoryIds = [
        parentId,
        ...subCategories.map((cat) => cat.id),
    ];

    /* 3️⃣ Fetch des produits */
    const prodRes = await fetch(
        `${API_BASE}/products?per_page=50&status=publish&category=${categoryIds.join(",")}`,
        { headers: authHeader() }
    );

    if (!prodRes.ok) return [];

    const products = await prodRes.json();
    return products.map(mapProduct);
}

/* =========================
   CATÉGORIES PAR PARENT
========================= */
export async function getProductCategoriesByParent(parentId) {
    const res = await fetch(
        `${API_BASE}/products/categories?parent=${parentId}&per_page=100`,
        { headers: authHeader() }
    );

    if (!res.ok) return [];

    const categories = await res.json();
    return categories.filter((cat) => cat.count > 0);
}