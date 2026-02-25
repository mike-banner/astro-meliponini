/* src/lib/cocart.js */
import { persistentAtom } from '@nanostores/persistent';

/**
 * STORE ET CONFIG
 */
const API_URL = "https://dev-shop.meliponini.fr/wp-json/cocart/v2";
export const cartKey = persistentAtom('cocart_cart_key', '');

export const cocartApi = {
    /**
     * Récupère la clé actuelle
     */
    getCartKey() {
        const key = cartKey.get();
        if (key === 'undefined' || key === 'null' || !key) return '';
        return key;
    },

    /**
     * Headers standardisés
     */
    getHeaders(isForm = false) {
        const headers = {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        };
        if (!isForm) {
            headers['Content-Type'] = 'application/json';
        } else {
            headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }
        return headers;
    },

    /**
     * Récupère le contenu du panier
     */
    async getCart() {
        const key = this.getCartKey();
        const url = key ? `${API_URL}/cart?cart_key=${key}` : `${API_URL}/cart`;

        try {
            const response = await fetch(url, { headers: this.getHeaders() });
            const data = await response.json();

            // Si la clé est invalide/inexistante côté serveur (404/403)
            if (response.status === 404 || response.status === 403) {
                cartKey.set('');
                return null;
            }

            if (data.cart_key) cartKey.set(data.cart_key);
            return data;
        } catch (error) {
            console.error("❌ [CoCart] Error getCart:", error);
            return null;
        }
    },

    /**
         * AJOUT AU PANIER - VERSION URL-PARAMS (FORCE)
         */
    async addItem(id, quantity = 1) {
        const key = this.getCartKey();
        const nonce = Date.now();

        // 1. On construit l'URL avec TOUS les paramètres dedans
        // C'est le seul moyen de garantir que WordPress voit la quantité comme un entier/valeur valide
        let url = `${API_URL}/cart/add-item?id=${id}&quantity=${parseInt(quantity, 10)}&_=${nonce}`;

        if (key && key !== "") {
            url += `&cart_key=${key}`;
        }

        try {
            const response = await fetch(url, {
                method: "POST", // On garde POST pour CoCart
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
                // Pas de body, tout est dans l'URL
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("❌ [CoCart] Server Error Data:", data);

                // Si la clé est corrompue, on nettoie pour le prochain essai
                if (response.status === 400 || response.status === 403) {
                    cartKey.set('');
                }
                throw new Error(data.message || "Erreur 400");
            }

            if (data.cart_key) cartKey.set(data.cart_key);
            return data;
        } catch (error) {
            console.error("❌ [CoCart] Error addItem:", error);
            throw error;
        }
    },
    /**
     * MISE À JOUR QUANTITÉ
     */
    async updateItem(item_key, quantity) {
        const key = this.getCartKey();
        const url = `${API_URL}/cart/item/${item_key}?cart_key=${key}`;

        const params = new URLSearchParams();
        params.append('quantity', String(quantity));

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: this.getHeaders(true),
                body: params.toString()
            });
            return await response.json();
        } catch (error) {
            console.error("❌ [CoCart] Error updateItem:", error);
            throw error;
        }
    },

    /**
     * SUPPRESSION ARTICLE
     */
    async deleteItem(item_key) {
        const key = this.getCartKey();
        const url = `${API_URL}/cart/item/${item_key}?cart_key=${key}`;

        try {
            const response = await fetch(url, {
                method: "DELETE",
                headers: this.getHeaders(),
            });
            return await response.json();
        } catch (error) {
            console.error("❌ [CoCart] Error deleteItem:", error);
            throw error;
        }
    }
};

/**
 * EXPORTS POUR COMPATIBILITÉ
 */
export const getCart = () => cocartApi.getCart();
export const addToCart = (id, q) => cocartApi.addItem(id, q);
export const updateItem = (k, q) => cocartApi.updateItem(k, q);
export const removeItem = (k) => cocartApi.deleteItem(k);

/**
 * CALCULS DES TOTAUX
 */
export function calculateTotals(cartData) {
    if (!cartData) return { total: "0 €", savings: 0, count: 0 };

    // 1. Calcul du compte d'articles
    const items = cartData.items ?
        (Array.isArray(cartData.items) ? cartData.items : Object.values(cartData.items)) :
        [];

    let manualCount = 0;
    let manualTotal = 0;

    items.forEach(item => {
        const qty = parseInt(item.quantity?.value || item.quantity || 0, 10);
        const itemPrice = parseFloat(String(item.price || 0));

        // Si le prix semble être en centimes (ex: 4500 pour 45.00)
        const normalizedPrice = (itemPrice > 1000 && !String(item.price).includes('.')) ? itemPrice / 100 : itemPrice;

        manualCount += qty;
        manualTotal += normalizedPrice * qty;
    });

    // 2. Formatage du total
    let displayTotal = cartData.totals?.total || "";

    // Si c'est un nombre brut sans symbole (ex: "16000" ou "160.00")
    if (!displayTotal.includes('€') && displayTotal !== "") {
        let val = parseFloat(displayTotal);
        // Détection des centimes (si > 500 et pas de point, probabilité forte de centimes pour du miel/bougie)
        if (val > 500 && !displayTotal.includes('.')) {
            val = val / 100;
        }
        displayTotal = val.toFixed(2).replace('.', ',') + " €";
    } else if (displayTotal === "") {
        displayTotal = manualTotal.toFixed(2).replace('.', ',') + " €";
    } else {
        // Simple remplacement pour les totaux déjà fournis avec symbole
        displayTotal = displayTotal.replace('.', ',');
    }

    return {
        total: displayTotal,
        count: parseInt(cartData.item_count || cartData.items_count || manualCount, 10),
        savings: 0
    };
}