# 📥 Registre des Tâches Différées (Defer)

Ce fichier consigne les améliorations techniques, idées et dettes repoussées pour une implémentation future.

## [Technique] Migration du CartKey vers Cookies (SSR)
*Date d'ajout : 21 Juillet 2026*

- **Quoi** : Remplacer le stockage client (`localStorage`) du `cartKey` par un cookie serveur.
- **Pourquoi** : 
  1. Permet à Astro (SSR) d'hydrater la page avec le compteur du panier avant l'envoi au navigateur (supprime l'effet visuel de "saut").
  2. Sécurise la base pour l'authentification future (JWT en HttpOnly).
  3. Permet de stocker des préférences (Devise, Langue) côté serveur.
- **Impact** : Amélioration de l'UX (zéro layout shift) & Sécurité.

## [UI/UX] Modales & Encarts pilotés par Cookies (SSR)
*Date d'ajout : 21 Juillet 2026*

Idées de composants exploitant l'état serveur (Cookies) pour une expérience Luxe sans flash côté client :
1. **Modale Bienvenue (Lead Gen)** : Capture d'email contre privilège, masquée définitivement dès le 1er refus/inscription (`has_visited`).
2. **Reprise de Panier (Rétention)** : Encart discret de rappel si l'utilisateur revient après une longue pause et possède un `cartKey` actif.
3. **Scarcity / Urgence** : Bannière sticky de réservation temporelle ("Miel réservé 15 min") calculée via l'état du panier.
4. **RGPD Luxe** : Modale de consentement minimale qui disparaît instantanément au prochain rechargement grâce à l'état serveur.
5. **Sélecteur Premium** : Préférences locales (Devise, Langue) appliquées par Astro avant le rendu de la page.
