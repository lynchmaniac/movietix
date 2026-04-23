# Feature: Réorganiser l'interface mobile pour placer l'input en haut

## 🎯 Problème
Sur smartphone, l'utilisateur voit d'abord le header avec le titre du film, puis l'article Wikipedia (long texte), puis l'input en bas de l'écran. Cela force l'utilisateur à scroller jusqu'en haut pour voir le texte et causer une mauvaise expérience UX.

## ✅ Solution
Réorganiser visuellement l'ordre des éléments sur mobile (< 600px) pour mettre:

1. **Header** (logo, erreurs, titre du film) — `order: 1`
2. **Input + Boutons** (saisie et jokers) — `order: 2`
3. **Article** (texte Wikipedia avec scroll) — `order: 3`

## 🔧 Modifications CSS

### Media query `@media (max-width: 600px)`

**Ajout des règles `order` pour réorganiser:**
- `.game-header { order: 1; }` — Reste en haut
- `.guess-panel { order: 2; }` — Monte en position 2
- `.article-zone { order: 3; }` — Descend en position 3

**Changements du `.guess-panel` sur mobile:**
- `position: static;` — Retire le sticky pour appliquer l'ordre
- Ajustement du background pour meilleure intégration
- Reste visible et accessible sans scrolling

**Changements du `.article-zone` sur mobile:**
- `flex: 1;` — Prend tout l'espace restant
- `overflow-y: auto;` — Scroll vertical si contenu long
- `min-height: 300px;` — Garantit un espace suffisant pour le contenu

## 🎨 Résultat visuel

**Avant (desktop & mobile):**
```
┌───────────────────────┐
│ Header (petit)        │  ← Logo, erreurs, titre
├───────────────────────┤
│ Article               │  ← Gros bloc de texte
│ (long, beaucoup de    │     (l'utilisateur doit
│  scroll)              │      scroller pour voir)
│                       │
│                       │
├───────────────────────┤
│ Input + Boutons       │  ← Caché en bas, hors écran
└───────────────────────┘
```

**Après sur mobile (< 600px):**
```
┌───────────────────────┐
│ Header (petit)        │  ← Logo, erreurs, titre
├───────────────────────┤
│ Input + Boutons       │  ← Visible immédiatement
│ [Deviner] [Joker]     │    (pas de scroll pour accéder)
├───────────────────────┤
│ Article               │  ← Scroll accessible
│ (long, beaucoup de    │    (swipe vers le bas)
│  scroll)              │
│                       │
└───────────────────────┘
```

**Desktop (> 600px) — Inchangé:**
```
┌────────────────────────────┐
│ Header                     │
├────────────────────────────┤
│ Article (lecteur peut      │
│ lire pendant qu'il joue)   │
├────────────────────────────┤
│ Input + Boutons (sticky)   │
└────────────────────────────┘
```

## 📱 Impact UX

✅ Input et boutons visibles immédiatement sur mobile  
✅ Pas de scroll initial pour accéder aux contrôles  
✅ Article toujours accessible avec scroll naturel  
✅ Meilleure accessibilité tactile (boutons avant contenu)  
✅ Desktop inchangé, expérience identique  

## 🧪 Test manuel

**Mobile (< 600px):**
1. Ouvrir le jeu sur smartphone
2. Header en haut ✓
3. Input + boutons Deviner/Joker visibles immédiatement ✓
4. Scroller vers le bas pour voir l'article ✓
5. Compteur jokers visible ✓

**Desktop (> 600px):**
1. Layout inchangé ✓
2. Sticky guess-panel en bas ✓
3. Aucune régression ✓

## 🔄 Compatibilité

- Pas de breaking change
- Réorganisation purement CSS (aucun changement HTML)
- Compatible avec toutes les résolutions mobile
- Desktop complètement inchangé
