# Codebase Structure

```text
melipone-astro/
├── src/
│   ├── assets/       # Static assets (images, fonts) processed by Vite
│   ├── components/   # Astro and React UI components
│   ├── data/         # Static data or config constants
│   ├── layouts/      # Astro layout templates
│   ├── lib/          # Utilities, helpers, and SDK wrappers (e.g., Medusa client)
│   ├── pages/        # File-based routing (Astro pages)
│   ├── styles/       # Global CSS (e.g., Tailwind directives)
│   └── types/        # Global TypeScript definitions
├── public/           # Raw static assets served directly
├── astro.config.mjs  # Astro configuration
├── tailwind.config.cjs # Tailwind theme and plugin config
└── components.json   # Likely a shadcn/ui or similar CLI registry config
```
