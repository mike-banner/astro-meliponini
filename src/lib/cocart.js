// src/lib/cocart.js
import { persistentAtom } from '@nanostores/persistent';
import { nanoid } from 'nanoid';

// Store persistant pour la cart key CoCart
export const cartKey = persistentAtom('cocart_cart_key', nanoid());

const API_URL = import.meta.env.PUBLIC_WC_API_URL || import.meta.env.WC_API_URL || "https://dev-shop.meliponini.fr";
const COCART_BASE = `${API_URL.replace(/\/$/, "")}/wp-json/cocart/v2`;

/**
 * Headers pour CoCart (Public API)
 */
function getHeaders() {
    return {
        'Content-Type': 'application/json'
    };
}

/**
 * Construit l'URL avec la cart_key en paramètre pour éviter les erreurs CORS sur les headers
 */
function getUrl(endpoint) {
    const key = cartKey.get();
    const separator = endpoint.includes('?') ? '&' : '?';
    return `${COCART_BASE}${endpoint}${key ? separator + 'cart_key=' + key : ''}`;
}

/**
 * Met à jour la clé du panier si l'API en renvoie une nouvelle
 */
function updateCartKey(data) {
    if (data && data.cart_key && data.cart_key !== cartKey.get()) {
        cartKey.set(data.cart_key);
    }
}

/**
 * Récupère le panier
 */
export async function getCart() {
    try {
        const url = getUrl('/cart');
        console.log('🚀 CoCart Call:', url);
        const res = await fetch(url, {
            headers: getHeaders()
        });
        if (!res.ok) return null;
        const data = await res.json();
        console.log('✅ CoCart Response:', data);
        updateCartKey(data);
        return data;
    } catch (e) {
        console.error("CoCart GetCart Error:", e);
        return null;
    }
}

/**
 * Ajoute un produit au panier
 */
export async function addToCart(id, quantity = 1) {
    try {
        const url = getUrl('/cart/add-item');
        console.log('🚀 CoCart Call:', url);
        const res = await fetch(url, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
                id: String(id),
                quantity: String(quantity)
            })
        });
        const data = await res.json();
        console.log('✅ CoCart Response:', data);
        updateCartKey(data);
        return data;
    } catch (e) {
        console.error("CoCart AddToCart Error:", e);
        throw e;
    }
}

/**
 * Met à jour la quantité d'un item
 */
export async function updateItem(itemKey, quantity) {
    try {
        const url = getUrl(`/cart/item/${itemKey}`);
        console.log('🚀 CoCart Call:', url);
        const res = await fetch(url, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
                quantity: String(quantity)
            })
        });
        const data = await res.json();
        console.log('✅ CoCart Response:', data);
        updateCartKey(data);
        return data;
    } catch (e) {
        console.error("CoCart UpdateItem Error:", e);
        throw e;
    }
}

/**
 * Supprime un item du panier
 */
export async function removeItem(itemKey) {
    try {
        const url = getUrl(`/cart/item/${itemKey}`);
        console.log('🚀 CoCart Call:', url);
        const res = await fetch(url, {
            method: 'DELETE',
            headers: getHeaders()
        });
        const data = await res.json();
        console.log('✅ CoCart Response:', data);
        updateCartKey(data);
        return data;
    } catch (e) {
        console.error("CoCart RemoveItem Error:", e);
        throw e;
    }
}

/**
 * Récupère le total et les économies
 */
export function calculateTotals(cartData) {
    if (!cartData || !cartData.items) return { total: "0 €", savings: 0, count: 0 };

    let total = 0;
    let regularTotal = 0;
    let count = 0;

    cartData.items.forEach(item => {
        const itemPrice = String(item.price);
        const price = parseFloat(itemPrice) / (itemPrice.length >= 3 ? 100 : 1);

        const regPriceStr = item.regular_price ? String(item.regular_price) : null;
        const regularPrice = regPriceStr ? (parseFloat(regPriceStr) / (regPriceStr.length >= 3 ? 100 : 1)) : price;

        const qty = parseInt(item.quantity.value);

        total += price * qty;
        regularTotal += regularPrice * qty;
        count += qty;
    });

    let displayTotal = cartData.totals?.total;
    if (!displayTotal || typeof displayTotal !== 'string' || !displayTotal.includes('€')) {
        displayTotal = total.toFixed(2) + " €";
    }

    return {
        total: displayTotal,
        savings: Math.max(0, regularTotal - total),
        count: cartData.item_count || cartData.items_count || count
    };
}
