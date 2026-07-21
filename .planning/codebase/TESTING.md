# Testing Strategy

## Current State
- **Unit Testing**: NO framework installed (Jest/Vitest missing).
- **E2E Testing**: NO framework installed (Playwright/Cypress missing).
- **Component Testing**: Not configured.

## Recommendations
- Install `vitest` for fast unit testing of utility functions (e.g., in `src/lib/`).
- Install `@testing-library/react` if complex interactive components are built.
- Install Playwright for critical E-commerce flows (Cart, Checkout) to ensure the MedusaJS integration doesn't break.
