# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Rules (non-negotiable)

From `PROJECT_RULES.md` — read this before making architectural changes:

- **Static only (SSG)** — `astro.config.mjs` has `output: 'static'`. No SSR.
- **No ecommerce logic in Astro.** Astro handles SEO, content, and performance. WordPress/WooCommerce handles data and checkout.
- **No dependency without business justification.**
- **If a feature doesn't help sell, it gets removed.**

## Commands

```bash
npm run dev       # astro dev — local dev server
npm run build     # astro build — static output to dist/
npm run preview   # astro preview — serve the built dist/
```

There is no lint, typecheck, or test script configured (no ESLint/Prettier/Vitest in `package.json`). Do not assume one exists.

## Environment

Copy `.env.example` to `.env` and set `WC_API_URL`, `WC_CONSUMER_KEY`, `WC_CONSUMER_SECRET` (WooCommerce REST API v3 credentials). These are server-only secrets used at build time — never expose them client-side.

The WooCommerce/CoCart backend (`dev-shop.meliponini.fr`) may sit behind a VPN; if product fetches fail at build time, check connectivity before assuming a code bug.

## Architecture

Headless commerce: **Astro (frontend) + WordPress/WooCommerce (backend)**, talking to two distinct WordPress APIs for two distinct purposes:

- **`src/lib/woocommerce.js`** — WooCommerce REST API v3 (`/wp-json/wc/v3`), Basic Auth via consumer key/secret. **Server-side only** (build time) — fetches and maps product catalog data (`mapProduct()` normalizes WC's raw product shape into what the UI consumes: `available`, `image`, `displayName`, etc.). Never call this from client-side React code — the auth secret would leak.
- **`src/lib/cocart.js`** — CoCart v2 API (`/wp-json/cocart/v2`), no auth, session-based via a `cart_key`. **Client-side** — cart mutations (add/remove/update), session persisted via `@nanostores/persistent` (`cartKey` atom). CoCart is the only place cart writes happen; WooCommerce API is read-only catalog data.
- **`src/lib/cartStore.js`** — the nanostores atom (`cartStore`) that UI components read/subscribe to. Wraps `cocart.js` calls (`refreshCart()`) and normalizes CoCart's cart response (object-or-array `items`) into a consistent array. Also owns the off-canvas cart open/close state (`toggleCart`).

Because cart state lives in nanostores and is shared across independently-hydrated React islands, always mutate through `cartStore.js`/`cocart.js` rather than fetching CoCart directly from a component — otherwise the off-canvas cart (`CartDrawer.tsx`) and any other cart-aware island will desync.

### Rendering model

- `.astro` files: pages, layouts, and structural components — the default choice.
- `.tsx` (React) files: only for components that need real interactivity/hydration (cart drawer, accordions, tabs). This is an Islands architecture — don't reach for React where an `.astro` component would do.

### UI conventions

- Tailwind is the styling system; shadcn/ui config lives in `components.json` (style: "new-york", alias `@/components`, `@/lib`, `@/components/ui`). Use `cn()` from `src/lib/utils.ts` (clsx + tailwind-merge) instead of manual class concatenation.
- Component variants go through `class-variance-authority` (cva), not conditional string interpolation.
- Radix UI primitives (`@radix-ui/react-accordion`, `@radix-ui/react-dialog`) back the accessible interactive components in `src/components/ui/`.

### Data flow for product pages

`src/pages/product/[slug].astro` and `src/pages/products.astro`/`products/*` fetch and render product data at build time via `woocommerceApi`. `src/data/families.ts` holds static bee-family taxonomy content (not fetched from WP) rendered on `familles.astro`/`famille.astro`.
