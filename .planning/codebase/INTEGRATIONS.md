# External Integrations

## WordPress / WooCommerce (Headless)
- **API**: CoCart v2 (`wp-json/cocart/v2`)
- **Purpose**: Handles all product catalog, cart logic, customer sessions, and checkout flows.
- **Connection**: REST API via `fetch` wrapped in `src/lib/cocart.js`. Uses persistent cart keys via Nanostores to sync sessions with the WordPress backend on VPN.

## Icons
- **Lucide React**: Provides SVG icons (`lucide-react`).
