// src/lib/woocommerce.js

/* =========================
   CONFIG
========================= */
const API_BASE =
    "https://meliponini.remyparis.com/wp-json/wc/v3";

const CONSUMER_KEY = import.meta.env.WC_CONSUMER_KEY;
const CONSUMER_SECRET = import.meta.env.WC_CONSUMER_SECRET;

/* =========================
   AUTH HEADER
========================= */
function authHeader() {
    return {
        Authorization:
            "Basic " +
            Buffer.from(
                `${CONSUMER_KEY}:${CONSUMER_SECRET}`
            ).toString("base64"),
    };
}

/* =========================
   MAPPING PRODUIT
========================= */
function mapProduct(product) {
    return {
        id: product.id,
        slug: product.slug,

        /* Titre éditorial (ex: N°5) */
        name: product.name,

        /* Nom réel du miel → via tags Woo */
        displayName:
            product.tags?.[0]?.name || "",

        latin:
            product.attributes?.find(
                (attr) => attr.name === "Nom latin"
            )?.options?.[0] || "",

        number: product.sku || "",

        price: product.price || "",
        available: product.stock_status === "instock",

        image:
            product.images?.[0]?.src ||
            "/images/placeholder.png",
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
        throw new Error("Erreur API WooCommerce (products)");
    }

    const data = await res.json();
    return data.map(mapProduct);
}

/* =========================
   PRODUITS PAR CATÉGORIE
   (parent + sous-catégories)
========================= */
export async function getProductsByCategory(slug) {

    /* 1️⃣ Catégorie parente */
    const catRes = await fetch(
        `${API_BASE}/products/categories?slug=${slug}`,
        { headers: authHeader() }
    );

    if (!catRes.ok) {
        throw new Error("Erreur API WooCommerce (categories)");
    }

    const categories = await catRes.json();
    if (!categories.length) return [];

    const parentId = categories[0].id;

    /* 2️⃣ Sous-catégories */
    const subRes = await fetch(
        `${API_BASE}/products/categories?parent=${parentId}&per_page=50`,
        { headers: authHeader() }
    );

    if (!subRes.ok) {
        throw new Error("Erreur API WooCommerce (sub-categories)");
    }

    const subCategories = await subRes.json();

    const categoryIds = [
        parentId,
        ...subCategories.map((cat) => cat.id),
    ];

    /* 3️⃣ Produits de toutes les catégories */
    const prodRes = await fetch(
        `${API_BASE}/products?per_page=50&status=publish&category=${categoryIds.join(",")}`,
        { headers: authHeader() }
    );

    if (!prodRes.ok) {
        throw new Error("Erreur API WooCommerce (products by category)");
    }

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

    if (!res.ok) {
        throw new Error("Erreur API WooCommerce (categories by parent)");
    }

    const categories = await res.json();

    // On filtre les catégories vides si besoin
    return categories.filter((cat) => cat.count > 0);
}
