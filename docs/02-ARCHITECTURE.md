# Architecture Technique

Ce document détaille l'architecture Headless de la plateforme Meliponini et les interactions entre les différents sous-systèmes.

## Le Modèle Headless : "Astro + React Islands"

Afin d'obtenir des performances parfaites tout en offrant une expérience utilisateur riche (panier dynamique, ajouts au panier asynchrones), l'architecture repose sur le concept des **Astro Islands**.

- **Le Layout et le Routage** : Gérés par Astro. Les pages (`index.astro`, `ProductCard.astro`) sont pré-générées ou rendues côté serveur (SSR). Elles livrent du HTML pur, sans aucun poids JavaScript inutile.
- **Les Composants Interactifs** : Gérés par React. Par exemple, le `<CartDrawer />` est hydraté côté client avec la directive `client:load`. Il ne charge le runtime React que lorsqu'il est nécessaire.

## Communication avec le Back-End (WordPress / WooCommerce)

Le site Meliponini n'utilise pas de base de données directe. Il communique avec une instance WordPress distante (hébergée sous `dev-shop.meliponini.fr`).

### L'API CoCart (Cart API)
Plutôt que d'utiliser l'API standard REST de WooCommerce (qui est lourde et orientée back-office), nous utilisons le plugin **CoCart v2**. 
- Il offre des endpoints rapides pour ajouter des items, mettre à jour les quantités, et récupérer le total.
- Il génère une `cart_key` unique stockée dans le LocalStorage du navigateur de l'utilisateur pour maintenir la session du panier de manière anonyme.

### Le flux d'achat (Checkout)
Puisque le front-end est Headless, le paiement sécurisé se déroule sur l'environnement WordPress.
1. L'utilisateur clique sur "Commander" dans le `CartDrawer.tsx` (Astro).
2. L'application récupère la `cart_key` active.
3. L'utilisateur est redirigé vers `https://dev-shop.meliponini.fr/checkout/?cocart-load-cart=[KEY]`.
4. Le back-end WooCommerce intercepte la clé, reconstitue le panier en PHP, et affiche la page de paiement native (Stripe/PayPal).

## Gestion d'État Global : Nanostores

Faire communiquer une île React (`CartDrawer.tsx`) avec un bouton d'ajout au panier rendu en HTML pur (`ProductCard.astro`) nécessite un store de données externe à React.

- **Fichier clé** : `src/lib/cartStore.js`
- **Outil** : `@nanostores/react` & `@nanostores/persistent`

Nanostores maintient un objet `cartStore` observable. 
- Lorsqu'un script Vanilla JS dans `ProductCard.astro` lance un `addToCart()`, il met à jour le serveur via l'API CoCart, puis fait muter le `cartStore`.
- Le composant React `<CartDrawer />`, qui est "abonné" à ce store via le hook `useStore(cartStore)`, se met instantanément à jour (ré-render) avec les nouvelles données et s'ouvre pour confirmer l'action à l'utilisateur.

## Sécurité & Environnement
Toutes les requêtes API sont effectuées en HTTPS. En environnement de développement, l'accès à l'API WordPress distante nécessite une connexion VPN active configurée pour le domaine de staging.
