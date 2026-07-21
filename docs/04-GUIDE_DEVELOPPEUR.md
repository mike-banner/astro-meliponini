# Guide Développeur

Ce manuel explique comment installer, configurer et travailler sur le code source de Meliponini Astro.

## 1. Pré-requis
- Node.js (v18+)
- npm ou pnpm
- Un accès réseau autorisé au serveur Staging/Production WordPress (`dev-shop.meliponini.fr`).

> ⚠️ **Important (Contrainte VPN)** : Toutes les requêtes d'ajout au panier, de mise à jour des quantités et de chargement des produits s'effectuent sur le domaine de dev/staging. **Il est impératif que le développeur ait son VPN activé** pour pouvoir résoudre et contacter le serveur WordPress. Si le VPN est inactif, les appels à l'API CoCart échoueront et le panier restera en statut "Chargement..." indéfiniment ou renverra une erreur CORS/Timeout.

## 2. Installation

1. Cloner le dépôt.
2. Installer les dépendances :
```bash
npm install
```
*(Remarque : Assurez-vous d'utiliser la version de Node appropriée. Les paquets critiques incluent `astro`, `react`, `@nanostores/react`, et les utilitaires `radix-ui`).*

## 3. Lancer le serveur de développement

```bash
npm run dev
```

Astro démarrera le projet sur `http://localhost:4321`. Le HMR (Hot Module Replacement) est actif pour les composants Astro, Tailwind et React.

## 4. Scripts utiles

- `npm run build` : Compile le site en mode production (`dist/`). C'est cette commande qui est exécutée par le pipeline CI/CD avant le déploiement sur Vercel/Netlify.
- `npm run preview` : Lance un serveur local pour tester la build générée par la commande précédente.
- `npx astro check` : Vérifie l'intégrité TypeScript des fichiers `.astro`.

## 5. Architecture des dossiers

```text
/src
├── components/       # Composants réutilisables (Astro & React)
│   ├── ui/           # Composants Shadcn (Sheet, Button, etc.)
│   ├── CartDrawer.tsx# Composant React du panier (Island)
│   └── Header.astro  # Header principal contenant la navigation
├── layouts/          # Layouts globaux (incluant le SEO de base)
├── lib/              # Fonctions utilitaires et API
│   ├── cartStore.js  # Store global Nanostores (persistant)
│   ├── cocart.js     # Wrapper pour les appels fetch vers l'API CoCart
│   └── utils.ts      # Utilitaires (ex: fusion de classes Tailwind `cn()`)
├── pages/            # Routage Astro (index.astro, /products, etc.)
└── styles/           # CSS Global (Tailwind, animations, police custom)
```

## 6. Bonnes pratiques de contribution
- Ne pas modifier directement les composants dans `/src/components/ui/` sauf pour des ajustements profonds de design. Ces composants sont standardisés par Shadcn.
- Préférer l'utilisation des classes Tailwind CSS (utilitaires) à l'ajout de CSS traditionnel, sauf pour la déclaration d'animations (`@keyframes`) ou de typographie spécifique (`@font-face`).
- Lors de l'ajout d'une interactivité complexe, écrire le composant en `.tsx` et l'importer dans Astro avec le marqueur `client:load`, `client:idle`, ou `client:visible` selon la priorité du rendu.
