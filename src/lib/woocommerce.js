/* src/lib/woocommerce.js */

/**
 * SERVICE WOOCOMMERCE - SÉCURISÉ (SERVEUR UNIQUEMENT)
 */

const API_URL = import.meta.env.WC_API_URL || "https://dev-shop.meliponini.fr";
const API_BASE = `${API_URL.replace(/\/$/, "")}/wp-json/wc/v3`;

// On prépare le header d'authentification Basic (Secrets .env)
const auth = btoa(`${import.meta.env.WC_CONSUMER_KEY}:${import.meta.env.WC_CONSUMER_SECRET}`);

export const woocommerceApi = {
    /**
     * Récupère les produits avec filtres
     */
    async getProducts(params = {}) {
        const queryParams = new URLSearchParams({
            status: 'publish',
            per_page: 50,
            ...params
        }).toString();
        const url = `${API_BASE}/products?${queryParams}`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error(`Erreur WC API: ${response.status}`);

            const products = await response.json();
            return products.map(product => this.mapProduct(product));
        } catch (error) {
            console.error("❌ [WC API] Error getProducts:", error);
            return [];
        }
    },

    /**
     * Nettoie la donnée pour Astro (Mapping complet pour l'UI)
     */
    mapProduct(product) {
        return {
            id: product.id,
            name: product.name,
            slug: product.slug,
            displayName: product.tags?.[0]?.name || "",
            latin: product.attributes?.find(attr => attr.name === "Nom latin")?.options?.[0] || "",
            price: product.price || "",
            regular_price: product.regular_price,
            sale_price: product.sale_price,
            available: (product.stock_status === "instock" || product.stock_status === "onbackorder") && !!product.price,
            image: product.images?.[0]?.src.replace("meliponini.remyparis.com", "dev-shop.meliponini.fr") || "/images/placeholder.png",
            description: product.short_description,
            excerpt: product.short_description || "",
            categories: product.categories.map(c => c.name),
            categorySlug: product.categories?.[0]?.slug || "",
            permalink: product.permalink || ""
        };
    },
    /**
     * Récupère les catégories enfants par ID parent
     */
    async getProductCategoriesByParent(parentId) {
        const url = `${API_BASE}/products/categories?parent=${parentId}&per_page=100`;
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) return [];
            const categories = await response.json();
            return categories.filter((cat) => cat.count > 0);
        } catch (error) {
            console.error("❌ [WC API] Error getProductCategoriesByParent:", error);
            return [];
        }
    }
};

/**
 * EXPORTS POUR COMPATIBILITÉ RÉTROACTIVE
 */
export const getProducts = (p) => woocommerceApi.getProducts(p);
export const getProductCategoriesByParent = (id) => woocommerceApi.getProductCategoriesByParent(id);

export async function getProductsByCategory(slug) {
    const url = `${API_BASE}/products/categories?slug=${slug}`;
    try {
        const res = await fetch(url, {
            headers: { 'Authorization': `Basic ${auth}` }
        });
        const categories = await res.json();
        if (categories && categories.length > 0) {
            return await woocommerceApi.getProducts({ category: categories[0].id });
        }
        return [];
    } catch (error) {
        console.error("❌ [WC API] Error getProductsByCategory:", error);
        return [];
    }
}