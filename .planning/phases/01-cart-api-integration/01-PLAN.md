# Phase 01 Plan: Cart & API Integration

**Goal:** Connect the frontend cart UI to the existing CoCart wrapper.

## Context
We are using Astro with React Islands. The `src/lib/cocart.js` file handles the backend communication (WordPress/WooCommerce via CoCart v2 API) and Nanostores handles the token/key state. We need to build the interactive cart drawer and wire up the "Add to Cart" buttons.

## Step 1: Cart State Management (Nanostores)
**File:** `src/lib/cartStore.ts` (New)
**Action:** Create a centralized store to hold the cart data (items, totals, loading state).
**Details:**
- Export a nanostore map `cartData` for the UI to consume.
- Export actions: `fetchCart()`, `addItemToCart(id, qty)`, `updateCartItem(key, qty)`, `removeCartItem(key)`.
- These actions will call the respective functions from `src/lib/cocart.js` and update `cartData`.

## Step 2: The Cart Drawer Component (React)
**File:** `src/components/CartDrawer.tsx` (New)
**Action:** Build the UI for the Cart.
**Details:**
- Use `src/components/ui/sheet.tsx` for the sliding side-drawer.
- Use `@nanostores/react` to read `cartData` and `cartStore` loading states.
- Display each item (image, name, price) with quantity +/- buttons and a remove button.
- Display the total price (calculated via `calculateTotals` in `cocart.js`).
- Include a "Commander" checkout button (can just redirect to the WP checkout URL for now).

## Step 3: Wire up the Header
**File:** `src/components/Header.astro`
**Action:** Add the Cart trigger.
**Details:**
- Mount the `<CartDrawer client:load />` inside the Header.
- Ensure the cart icon shows a badge with the current item count.

## Step 4: Wire up Product Cards & Hero
**Files:** `src/components/ProductCard.astro` and `src/components/ProductHero.astro`
**Action:** Replace static "Add to cart" with interactive logic.
**Details:**
- Create a minimal React wrapper `AddToCartButton.tsx` that calls `addItemToCart` from the store and triggers a success toast or opens the Cart Drawer.
- Replace the static buttons in `.astro` components with `<AddToCartButton productId={id} client:load />`.

## Risks & Dependencies
- **VPN / API Availability:** The WooCommerce API (`dev-shop.meliponini.fr`) must be reachable from the development machine to fetch real product IDs.
- **Hydration:** Ensure the `cartKey` (persistent atom) does not cause hydration mismatches between Astro SSR and React client.

## Definition of Done
- User can click "Add to Cart" on a product.
- Cart drawer opens automatically or icon updates.
- User can change quantities or delete items in the drawer.
- Totals match the backend calculation.
