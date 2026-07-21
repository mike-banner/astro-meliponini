# Meliponini — E-Commerce Headless de Luxe

Bienvenue dans la documentation officielle du projet **Meliponini Astro**. 

Ce document s'adresse aussi bien aux développeurs souhaitant comprendre l'architecture du projet qu'aux recruteurs techniques évaluant les choix technologiques et la qualité d'exécution de cette plateforme e-commerce.

## 🎯 Vision du Projet
**Meliponini** est une marque de miel de luxe et médicinal (produit par des abeilles Mélipones sans dard). La plateforme e-commerce devait refléter cette rareté et ce positionnement haut de gamme à travers :
- **Une UI/UX Premium** : Design minimaliste, typographie inspirée des magazines de luxe, micro-interactions subtiles.
- **Des performances de pointe** : Un chargement instantané grâce au rendu hybride, crucial pour le SEO et le taux de conversion e-commerce.
- **Une gestion de contenu fluide** : Un back-office familier pour le client (WordPress/WooCommerce) mais totalement découplé du front-end.

## 🛠️ Stack Technologique (La "Jamstack" Moderne)

Pour répondre à ces enjeux, nous avons opté pour une approche **Headless** :

1. **Front-End : Astro (v5)**
   - Choisi pour sa performance extrême ("Zero-JS by default") et son architecture d'îlots (Islands Architecture).
   - Permet de générer des pages statiques ultra-rapides tout en gardant des composants interactifs uniquement là où c'est nécessaire.

2. **UI & Interactivité : React 19 & Shadcn UI**
   - React est utilisé uniquement pour les composants interactifs complexes (comme le tiroir du panier `CartDrawer`).
   - L'utilisation de **Shadcn UI** et **Tailwind CSS** garantit une accessibilité parfaite, un design Mobile-First et un code maintenable.

3. **State Management : Nanostores**
   - Utilisé pour gérer l'état du panier entre différents composants (Astro et React) sans polluer le contexte global. Nanostores est agnostique au framework, parfait pour l'écosystème Astro.

4. **Back-End & API : WooCommerce & CoCart v2**
   - Le moteur e-commerce reste WooCommerce (pour la gestion des stocks, commandes, paiements).
   - L'API **CoCart v2** est utilisée pour manipuler le panier via des requêtes REST rapides et sécurisées, en mode sessionless.

## 📈 Impact et Compétences Démontrées
Ce projet illustre une maîtrise avancée de l'ingénierie front-end moderne :
- **Séparation des préoccupations (Headless)** : Découplage total entre la présentation (Astro) et la logique métier (WooCommerce).
- **Optimisation Web Core Vitals** : Rendu SSR/SSG, lazy-loading d'images, animations basées sur CSS/IntersectionObserver.
- **Intégration d'API tierces** : Synchronisation asynchrone sécurisée avec une API REST distante.
- **Design System rigoureux** : Maîtrise des tokens CSS, du typage visuel et des standards d'accessibilité (Radix UI).

---
**Lectures recommandées :**
- [02 - Architecture Technique](./02-ARCHITECTURE.md)
- [03 - Design System & UI](./03-DESIGN_SYSTEM.md)
- [04 - Guide Développeur](./04-GUIDE_DEVELOPPEUR.md)
