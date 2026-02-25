import { persistentAtom } from '@nanostores/persistent';
import { getCart, calculateTotals } from './cocart.js';

// État initial du panier avec persistance
export const cartStore = persistentAtom('melipone_cart_state', {
    items: [],
    totals: { total: 0, savings: 0, count: 0 },
    loading: false,
    isOpen: false
}, {
    encode: JSON.stringify,
    decode: JSON.parse
});

/**
 * Charge les données du panier depuis l'API
 */
export async function refreshCart() {
    const current = cartStore.get();
    cartStore.set({ ...current, loading: true });

    const data = await getCart();
    if (data) {
        // Normalisation : CoCart v2 renvoie souvent un objet, on veut un tableau
        const itemsArray = Array.isArray(data.items) ? data.items : Object.values(data.items || {});
        cartStore.set({
            ...current,
            items: itemsArray,
            totals: calculateTotals(data),
            loading: false
        });
    } else {
        cartStore.set({ ...current, loading: false });
    }
}

/**
 * Ouvre/Ferme l'off-canvas
 */
export function toggleCart(force) {
    const current = cartStore.get();
    const newState = typeof force === 'boolean' ? force : !current.isOpen;

    cartStore.set({ ...current, isOpen: newState });

    if (newState) {
        document.body.classList.add('elementor-offcanvas-active');
    } else {
        document.body.classList.remove('elementor-offcanvas-active');
    }
}
