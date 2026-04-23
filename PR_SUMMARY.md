# PR: Afficher le résumé sur la page de victoire

## 🎯 Objectif
Afficher le résumé Wikipedia complet sur la page de victoire et de défaite, pour que l'utilisateur puisse lire le contexte complet du film une fois la partie terminée.

## 📝 Description
Lorsqu'un utilisateur gagne ou perd une partie, la page de fin affiche maintenant :
- Le titre du film ✅
- Les statistiques (nombre d'erreurs) ✅
- **LE RÉSUMÉ COMPLET** (NOUVEAU) ✨

## 🔧 Modifications

### 1. **js/game.js**
- Ajout de la fonction `getExtract()` pour exporter le résumé complet du film

### 2. **index.html**
- Ajout d'une section `result-extract-wrap` sur la page de victoire (`#screen-win`)
- Ajout d'une section `result-extract-wrap` sur la page de défaite (`#screen-lose`)
- Chaque section contient un label "Résumé complet :" et un élément `<p id="win-extract">` / `<p id="lose-extract">`

### 3. **js/app.js**
- Import de `getExtract` depuis game.js
- Ajout des références DOM `winExtract` et `loseExtract`
- Modification de `showWin()` pour afficher le résumé dans `els.winExtract.textContent`
- Modification de `showLose()` pour afficher le résumé dans `els.loseExtract.textContent`

### 4. **css/style.css**
- Ajout de `.result-extract-wrap` : conteneur avec bordure supérieure dorée
- Ajout de `.result-extract-label` : libellé en majuscules, couleur or
- Ajout de `.result-extract` : texte du résumé avec :
  - Hauteur max 200px avec scroll
  - Fond semi-transparent
  - Bordure gauche dorée
  - Texte justifié, lignes espacées
  - Thème cohérent avec le design cinématic du jeu

## 🎨 Comportement visuel
```
┌─────────────────────────────────────┐
│ 🏆 BRAVO!                           │
├─────────────────────────────────────┤
│ « Le Titre du Film »                │
│ 3 erreurs commises.                 │
│                                     │
│ Résumé complet:                     │
│ ┌───────────────────────────────┐   │
│ │ [Texte du résumé Wikipedia    │   │
│ │  avec scroll si trop long]    │   │
│ └───────────────────────────────┘   │
│                                     │
│ [↩ REJOUER]                         │
└─────────────────────────────────────┘
```

## ✨ Caractéristiques
- ✅ Le résumé s'affiche clairement sur fond semi-transparent
- ✅ Scroll automatique si le texte est trop long (max 200px)
- ✅ Bordure dorée cohabitant avec le design existant
- ✅ Fonctionne pour les deux cas : victoire et défaite
- ✅ Texte brut pour éviter les injections XSS
- ✅ Responsive et cohérent avec le design global

## 🧪 Test manuel
1. Jouer une partie et gagner → Le résumé s'affiche sur la page de victoire
2. Jouer une partie et perdre → Le résumé s'affiche sur la page de défaite
3. Résumé long → Scroll vertical disponible
4. Vérifier que le design ne casse pas les autres résolutions

## 🔄 Compatibilité
- Aucune breaking change
- Les anciennes fonctionnalités restent intactes
- Amélioration purement additive

---

**Branche:** `feature/display-summary-on-victory`
