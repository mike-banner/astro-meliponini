# Design System & Lignes Directrices UI

Le design de **Meliponini Astro** vise à transmettre l'exclusivité, la rareté et les propriétés médicinales du miel de Mélipones.

L'objectif visuel a été évalué et validé via un audit UI complet (Score 24/24 sur le référentiel interne), garantissant un alignement total avec l'esthétique "Luxe / Éditorial".

## 1. Principes Fondamentaux
- **Mobile-First** : L'interface est conçue pour l'écran mobile en priorité, avec des interactions tactiles fluides. Les tiroirs (`Off-canvas`) glissent avec une largeur de `100vw` sur mobile pour maximiser l'espace.
- **Respirabilité** : Utilisation généreuse de padding et de marges (`vh/vw`) pour encadrer les produits comme des œuvres d'art dans une galerie.
- **Minimalisme Fonctionnel** : Aucune fioriture visuelle. L'attention est dirigée vers le produit, le texte et l'action.

## 2. Palette de Couleurs (Tailwind CSS Variables)

La palette repose sur une structure monochrome stricte, rehaussée de touches subtiles.

- **Fonds & Textes** : `#000000` (Texte principal, Boutons primaires), `#ffffff` (Backgrounds purs), `#fafafa` (Gris très clair pour détacher les sections).
- **L'Accent Luxe (Gold/Ambre)** : 
  - Variable CSS : `--accent-gold: 43 74% 50%;` (Équivalent HSL de `#d4af37`).
  - Utilisé par petites touches (hover, soulignements, détails) pour rappeler la couleur du miel et briser le monochrome de manière élégante.
- **Bordures** : Gérées via Tailwind (`border-border`), très discrètes avec une opacité réduite.

## 3. Typographie (Fontes Corporate)

Le projet intègre une typographie "Corporate" issue de l'univers de la mode et du luxe : **abchannel** (dérivée de *abchanelcorpo-regular*).

**Règles de hiérarchie :**
- Les balises `<h1>`, `<h2>`, `<h3>` sont forcées en majuscules (`text-transform: uppercase`).
- **Font-weight :** Bloqué à `400` (Regular) même pour les titres, empêchant l'effet de lourdeur visuelle ("chunky"). 
- **Letter-spacing (Tracking) :** Très large (`0.10em` à `0.12em` globalement, ou `tracking-widest` dans Tailwind) pour imiter la mise en page des magazines éditoriaux.
- Pour marquer l'emphase (`<strong>`, `<b>`), on utilise un poids de `400` à `600` maximum avec un léger espacement.

## 4. Micro-Copy & Boutons

Un site premium ne peut pas se contenter de libellés génériques ("Voir Plus", "Acheter"). Le Copywriting ("Micro-copy") fait partie du design system.

- **Appels à l'action aspirationnels** : "Découvrir nos élixirs", "Percer le mystère", "Explorer la collection".
- **Composant Bouton (Shadcn)** : Boutons carrés ou à bords très nets (pas de gros border-radius arrondi). Fond transparent contour noir (Outline) pour la navigation, et fond noir texte blanc pour les actions d'engagement fort ("Commander").

## 5. Animations et Expérience (UX)

- **Intersection Observer** : Des classes utilitaires `.fade-up` couplées à une API native `IntersectionObserver` permettent l'apparition douce et en translation (Y: 30px) des blocs au scroll de l'utilisateur.
- **Tiroir Radix (Shadcn Sheet)** : L'animation d'entrée du panier bénéficie d'un flou d'arrière-plan (`backdrop-filter`) et d'un overlay (`z-index: 10001`) assurant un focus total de l'attention sans parasitage visuel du header.
