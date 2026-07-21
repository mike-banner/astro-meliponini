# Codebase Architecture

## Overview
Astro 5 project using React 19 for UI components and TailwindCSS for styling. The application connects to a Headless WordPress/WooCommerce backend (via CoCart) for e-commerce capabilities.

## Rendering Strategy
- **Astro**: Core framework handling routing and page layouts.
- **Islands Architecture**: React components are hydrated only where necessary (interactive parts like shopping cart, product variants, etc.).

## State Management
- **Nanostores**: Used for persistent client-side state across Astro islands (e.g., shopping cart keys, user session).

## UI/Styling
- **TailwindCSS**: Utility-first CSS framework.
- **Radix UI**: Unstyled accessible primitives used to build complex components (Accordion, Dialog).
- **CVA (class-variance-authority)**: Used for constructing component variants securely.
