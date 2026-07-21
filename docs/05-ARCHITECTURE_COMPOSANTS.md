# Plan d'Architecture : Modularisation et Réduction de la Dette Technique (CSS/JSX)

Ce plan vise à restructurer les fichiers monolithiques (souvent appelés génériquement `app.css` / `app.jsx`, correspondant ici à `global.css`, `Header.astro`, `Layout.astro`) afin de rendre le code plus maintenable, modulaire, et performant.

## 1. Constat Actuel
- **CSS Monolithique** : Le fichier `global.css` contient un mélange de variables, de resets, de typographie, de styles spécifiques aux pages (`.products-page`, `.secrets-page`), d'animations et de composants (`.btn`, `.burger`).
- **Composants Obèses** : `Header.astro` (plus de 640 lignes) regroupe la navigation desktop, le menu mobile (off-canvas), le bouton du panier, du JavaScript natif complexe et un bloc `<style>` massif.

## 2. Nouvelle Architecture des Dossiers

Afin d'isoler les éléments répétitifs, nous allons adopter une structure orientée **Atomic Design / Feature** dans le dossier `src/` :

```text
/src
├── components/
│   ├── ui/                 # Composants atomiques réutilisables (Boutons, Badges, etc.)
│   │   ├── Button.astro    # Remplace les classes .btn, .hero-btn
│   │   ├── Logo.astro      # Composant Logo centralisé
│   │   └── Container.astro # Gère les marges et l'offset global
│   │
│   ├── layout/             # Éléments de structure globale
│   │   ├── Header/
│   │   │   ├── Header.astro       # Devient un simple conteneur orchestrateur
│   │   │   ├── DesktopNav.astro   # Menu sticky desktop
│   │   │   ├── MobileMenu.astro   # Off-canvas mobile + Burger
│   │   │   └── TopBanner.astro    # Si applicable
│   │   └── Footer/
│   │
│   ├── cart/               # Composants liés au tunnel d'achat
│   │   ├── CartButton.astro# Le bouton avec le compteur
│   │   └── CartDrawer.tsx  # L'island React existante
│   │
├── styles/                 # CSS global fragmenté
│   ├── design-tokens.css   # Variables CSS pures (couleurs, espacements, fonts)
│   ├── base.css            # Resets et configuration du <body>
│   ├── typography.css      # h1, h2, h3, fonts spécifiques
│   └── animations.css      # @keyframes, .fade-up
```

## 3. Stratégie de Réduction pour `app.css` (global.css)

L'objectif est de vider le fichier CSS global de tout ce qui appartient à des composants spécifiques.

1. **Suppression des classes de page** : Les marges comme `.products-page { padding-top: ... }` doivent être gérées via un composant layout global `<PageContainer>` ou en utilisant les classes utilitaires Tailwind (ex: `pt-[128px]`).
2. **Modularisation des Boutons** : Supprimer les styles `.btn`, `.hero-btn` du CSS global. Créer un composant `<Button variant="primary" />` (React) ou `Button.astro` qui encapsule ses propres styles ou classes Tailwind.
3. **Scoping Astro** : Pour les éléments propres à un layout (comme la navbar), utiliser la balise `<style>` native de `.astro` qui scope automatiquement le CSS au composant, évitant les fuites et réduisant la taille du fichier global.

## 4. Stratégie de Réduction pour `app.jsx` (Header.astro / Layout.astro)

L'objectif est de diviser pour régner : un composant = une responsabilité.

1. **Extraction de la Navigation Mobile** : 
   - Créer `MobileMenu.astro`.
   - Déplacer l'HTML du off-canvas et son script de toggle associé (`document.getElementById("menuButton")...`) à l'intérieur de ce nouveau fichier.
2. **Extraction de la Navigation Desktop** :
   - Créer `DesktopNav.astro`.
3. **Extraction de la logique Panier** :
   - Le bouton "Commander" (WooCommerce) et le script de souscription au `cartStore` doivent être encapsulés dans un composant interactif `FloatingCheckoutBtn.tsx` ou isolés dans un script modulaire.
4. **Composant Header Simplifié** :
   Après restructuration, `Header.astro` ne devrait ressembler qu'à ceci :
   ```astro
   ---
   import Logo from "../ui/Logo.astro";
   import DesktopNav from "./DesktopNav.astro";
   import MobileMenu from "./MobileMenu.astro";
   import CartButton from "../cart/CartButton.astro";
   import { CartDrawer } from "../cart/CartDrawer.tsx";
   ---
   <header class="header-fixe group" id="main-header">
       <div class="header-inner">
           <MobileMenu />
           <Logo />
           <CartButton />
       </div>
       <DesktopNav />
   </header>
   <CartDrawer client:load />
   <script src="./Header.logic.ts"></script>
   ```

## 5. Bénéfices
- **Maintenabilité** : En cas de bug sur le menu mobile, le développeur ouvre `MobileMenu.astro` (100 lignes) au lieu de `Header.astro` (650 lignes).
- **Performance** : En isolant les styles dans les composants Astro, seul le CSS réellement utilisé sur la page est injecté par Astro lors du build.
- **Réutilisabilité** : Des composants comme `<Button>` ou `<Logo>` pourront être utilisés n'importe où sans dupliquer le CSS.
