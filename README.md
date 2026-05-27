# 🐝 Meliponini — Vitrine E-commerce Headless

Site e-commerce pour une marque de miels enzymatiques de mélipones.

**Architecture headless : Astro (front) + WordPress/WooCommerce (back) + VPS**

🔗 [Site live](https://dev-shop.meliponini.fr)

---

## 🚀 Démarrage Rapide

### 1. Installer les dépendances
```bash
npm install
```

### 2. Configurer l'environnement
Copiez le fichier `.env.example` en `.env` :
```bash
cp .env.example .env
```
Renseignez les variables requises :
*   `WC_API_URL` : URL de votre site WordPress (ex: `https://your-wordpress-site.com`)
*   `WC_CONSUMER_KEY` : Clé client WooCommerce REST API
*   `WC_CONSUMER_SECRET` : Clé secrète WooCommerce REST API

### 3. Lancer en développement
```bash
npm run dev
```

---

## 🏗️ Architecture

- **Frontend** : Astro + React + TypeScript — servi en statique/SSR
- **Backend CMS** : WordPress + WooCommerce sur VPS dédié
- **Connexion** : REST API WooCommerce (produits, catégories, contenus)
- **Styles** : Tailwind CSS

Le frontend est totalement découplé du CMS : WordPress gère le contenu, Astro gère le rendu et la performance.

---

## 🛠️ Ce que ça démontre

- Intégration Astro ↔ WordPress REST API
- Architecture headless sur projet client réel
- Gestion d'un CMS e-commerce (WooCommerce) via API
- Déploiement sur VPS

---

## 📦 Stack

`Astro` `React` `TypeScript` `Tailwind CSS` `WordPress` `WooCommerce` `REST API` `VPS`
