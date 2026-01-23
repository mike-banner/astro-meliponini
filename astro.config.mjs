// file:///home/mike/projects/astro/melipone-astro/astro.config.mjs
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    output: 'static', // Explicit SSG (default, but good to be explicit for clarity)
    build: {
        format: 'file'
    }
});
