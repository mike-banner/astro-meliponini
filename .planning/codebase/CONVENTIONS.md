# Coding Conventions

## Framework Usage
- **Astro**: Use `.astro` files for pages, layouts, and static structural components.
- **React**: Use `.tsx` files strictly for highly interactive client-side components ("Islands").

## Styling
- **Tailwind**: Primary styling method. Use `cn()` utility (clsx + tailwind-merge) for dynamic class names.
- **Variants**: Use `class-variance-authority` (cva) for defining UI component variants instead of complex string interpolations.

## State
- Use `@nanostores/react` to bind atoms to React components. Keep global state minimal.
