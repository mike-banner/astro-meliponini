#!/usr/bin/env node
// ponytail: script maison (assert + Playwright), pas de framework de test —
// suffisant pour attraper les régressions CSS/JS déjà rencontrées une fois.
//
// Usage:
//   node scripts/visual-check.mjs                # démarre `astro dev` tout seul
//   VISUAL_CHECK_URL=http://localhost:4321 node scripts/visual-check.mjs   # contre un serveur déjà lancé

import { chromium } from "playwright";
import { spawn } from "node:child_process";
import assert from "node:assert/strict";

const EXTERNAL_URL = process.env.VISUAL_CHECK_URL;
const PORT = 4599;
const BASE_URL = EXTERNAL_URL || `http://localhost:${PORT}`;

const WIDTHS = [320, 375, 390];
const PAGES = ["/", "/products/miel", "/products/bougie"];

let failures = 0;
const ok = (label) => console.log(`  ✓ ${label}`);
const fail = (label, detail) => {
    failures++;
    console.error(`  ✗ ${label}${detail ? ` — ${detail}` : ""}`);
};

async function waitForServer(url, timeoutMs = 30000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
        try {
            const res = await fetch(url);
            if (res.ok || res.status < 500) return;
        } catch {
            // pas encore prêt
        }
        await new Promise((r) => setTimeout(r, 300));
    }
    throw new Error(`Serveur non disponible sur ${url} après ${timeoutMs}ms`);
}

async function checkNoHorizontalScroll(page, path, width) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(BASE_URL + path, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const label = `pas de scroll horizontal — ${path} @ ${width}px`;
    try {
        assert.ok(scrollWidth <= width + 1, `scrollWidth=${scrollWidth} > ${width}`);
        ok(label);
    } catch (e) {
        fail(label, e.message);
    }
}

async function checkFadeUpReveals(page, path) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASE_URL + path, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    // Scrolle toute la page (par pas d'un écran) pour laisser l'IntersectionObserver
    // déclencher la révélation de chaque section, comme le ferait un vrai visiteur.
    await page.evaluate(async () => {
        const step = window.innerHeight;
        const max = document.body.scrollHeight;
        for (let y = 0; y < max; y += step) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 250));
        }
        window.scrollTo(0, max);
        await new Promise((r) => setTimeout(r, 250));
    });
    const hidden = await page.evaluate(
        () => document.querySelectorAll(".fade-up:not(.visible)").length,
    );
    const label = `.fade-up bien révélé après scroll complet — ${path}`;
    try {
        assert.equal(hidden, 0, `${hidden} élément(s) .fade-up jamais révélé(s)`);
        ok(label);
    } catch (e) {
        fail(label, e.message);
    }
}

async function checkHeaderNoOverlap(page) {
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto(BASE_URL + "/", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    const { logo, burger, cart } = await page.evaluate(() => ({
        logo: document.querySelector(".logo")?.getBoundingClientRect(),
        burger: document.querySelector(".burger")?.getBoundingClientRect(),
        cart: document.querySelector(".custom-cart-icon")?.getBoundingClientRect(),
    }));
    const label = "logo ne chevauche pas burger/panier @ 320px";
    try {
        assert.ok(logo && burger && cart, "élément(s) du header introuvable(s)");
        assert.ok(logo.left >= burger.right, `logo.left=${logo.left} < burger.right=${burger.right}`);
        assert.ok(logo.right <= cart.left, `logo.right=${logo.right} > cart.left=${cart.left}`);
        ok(label);
    } catch (e) {
        fail(label, e.message);
    }
}

async function checkDiscoverButtonSizes(page) {
    await page.setViewportSize({ width: 375, height: 844 });
    await page.goto(BASE_URL + "/products/miel", { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);
    await page.click("[data-layout-toggle]");
    await page.waitForTimeout(1000);
    const widths = await page.evaluate(() =>
        [...document.querySelectorAll(".product-discover-btn")].map(
            (el) => el.getBoundingClientRect().width,
        ),
    );
    const label = "boutons Découvrir de même largeur en mode 2 colonnes";
    try {
        assert.ok(widths.length > 1, "pas assez de boutons trouvés pour comparer");
        const [first, ...rest] = widths;
        for (const w of rest) {
            assert.ok(Math.abs(w - first) <= 1, `largeurs différentes: ${widths.join(", ")}`);
        }
        ok(label);
    } catch (e) {
        fail(label, e.message);
    }
}

async function main() {
    let devServer;
    if (!EXTERNAL_URL) {
        console.log(`Démarrage de "astro dev" sur le port ${PORT}...`);
        devServer = spawn("npx", ["astro", "dev", "--port", String(PORT)], {
            stdio: "ignore",
            detached: true,
        });
        await waitForServer(BASE_URL);
    }

    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {
        console.log("\nDébordement horizontal:");
        for (const path of PAGES) {
            for (const width of WIDTHS) {
                await checkNoHorizontalScroll(page, path, width);
            }
        }

        console.log("\nApparition au scroll (fade-up):");
        for (const path of PAGES) {
            await checkFadeUpReveals(page, path);
        }

        console.log("\nHeader mobile:");
        await checkHeaderNoOverlap(page);

        console.log("\nGrille produit 2 colonnes:");
        await checkDiscoverButtonSizes(page);
    } finally {
        await browser.close();
        if (devServer) {
            process.kill(-devServer.pid);
        }
    }

    console.log(`\n${failures === 0 ? "✅ Tout est bon" : `❌ ${failures} vérification(s) en échec`}`);
    process.exit(failures === 0 ? 0 : 1);
}

main().catch((err) => {
    console.error("Erreur inattendue:", err);
    process.exit(1);
});
