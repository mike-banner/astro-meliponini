# Melipone Astro Headless

## What This Is
A premium, headless e-commerce landing page and store for luxury Meliponini honey. Powered by Astro, React, Tailwind CSS, and a WordPress/WooCommerce (CoCart v2) backend over a VPN.

## Core Value
Delivering a high-end, lightning-fast "luxury brand" experience while leveraging WordPress for robust content and order management.

## Key Decisions
| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Headless WP | Existing backend ecosystem and CoCart support | Active |
| Astro Islands | Best performance for static content with interactive cart | Active |
| Nanostores | Share state between Astro and React easily | Active |

## Requirements
### Validated
- ✓ Astro + React setup
- ✓ Basic UI components (Radix, Tailwind)
- ✓ CoCart fetch wrappers (`src/lib/cocart.js`)

### Active
- [ ] Implement cart UI using the CoCart logic.
- [ ] Redesign landing page with premium typography and gold/amber accents.
- [ ] Connect to live VPN endpoint for product catalog.

### Out of Scope
- MedusaJS (removed)

---
*Last updated: 2026-07-21 after initialization*
