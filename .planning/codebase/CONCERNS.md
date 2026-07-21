# Codebase Concerns

## Current Issues & Risks
1. **Testing Void**: No testing framework (e.g., Vitest, Playwright, or Cypress) is currently configured in `package.json`.
2. **Missing Eslint/Prettier**: No linting or formatting tools are explicitly declared in the dependencies.
3. **E-commerce Sync**: State synchronization between the WordPress/CoCart backend and Nanostores needs careful handling, especially since WP enforces integer quantities and strict URL params.
4. **React 19 Compatibility**: React 19 is bleeding edge; need to ensure Radix UI and Nanostores React integrations are fully compatible without hydration warnings.
5. **VPN Dependency**: The WooCommerce API (`https://dev-shop.meliponini.fr/wp-json/cocart/v2`) might be locked behind a VPN, which could impact build-time SSR generation or CI/CD pipelines if they cannot access the endpoint.
