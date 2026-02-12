# Correction - Logo MELIPONINI qui bouge selon les pages

## Problème identifié

Le logo "MELIPONINI" dans le header se décale vers la droite sur certaines pages, notamment `/le-secret-des-miels-enzimatiques/le-trehalulose`.

## Causes possibles

1. **Conflit de CSS** : Il y a du CSS pour `.header-fixe .logo` dans plusieurs fichiers :
   - `src/components/Header.astro` (ligne 251-280)
   - `src/styles/global.css` (ligne 103-125)

2. **Police "abchannel"** : La police custom pourrait avoir des glyphes avec des espacements différents

3. **Ordre de chargement CSS** : Le CSS global pourrait être chargé avant ou après le CSS du composant selon la page

4. **Cache du navigateur** : Les styles pourraient être en cache

## Solutions proposées

### Solution 1 : Supprimer la duplication de CSS
Supprimer complètement le style `.header-fixe .logo` de `global.css` et garder uniquement celui dans `Header.astro`.

### Solution 2 : Utiliser une classe unique avec !important partout
Créer une classe `.logo-center` avec tous les styles en `!important` pour forcer l'override.

### Solution 3 : Vérifier la police
Remplacer temporairement `font-family: "abchannel"` par `font-family: system-ui` pour voir si le problème vient de la police.

### Solution 4 : Inspecter dans le navigateur
Ouvrir les DevTools (F12) sur la page problématique et inspecter le logo pour voir quels styles sont appliqués et d'où ils viennent.

## Recommandation

Je recommande de commencer par la **Solution 4** : inspecter le logo dans le navigateur pour voir exactement quels styles sont appliqués et identifier le conflit.

Ensuite, appliquer la **Solution 1** : supprimer la duplication de CSS pour avoir une seule source de vérité.

## Questions

1. Le décalage se produit-il uniquement sur cette page ou sur d'autres aussi ?
2. Le décalage est-il visible immédiatement au chargement ou après un scroll ?
3. As-tu essayé de vider le cache du navigateur (Ctrl+Shift+R) ?
