# Fix: Améliorer la responsivité du bouton Joker sur mobile

## 🎯 Problème
Le bouton Joker est trop à droite et difficile à cliquer sur smartphones. Avec 3 éléments dans `.guess-row` (input + btn-guess + btn-joker), l'espace disponible était insuffisant, rendant les boutons serrés et peu accessibles.

## ✅ Solution
Sur mobile (< 600px), le layout passe à une disposition verticale optimisée:

```
Desktop (> 600px):
[      input       ] [Deviner] [Joker]

Mobile (≤ 600px):
[      input       ]
[Deviner] [Joker]
```

## 🔧 Modifications CSS

### Media query `@media (max-width: 600px)`

1. **`.guess-row`**
   - Ajout de `flex-wrap: wrap` pour permettre le passage à la ligne
   - Réduction du gap à `.4rem` pour plus d'espace

2. **`.guess-input`**
   - `flex: 1 1 100%` pour prendre 100% de la largeur en première ligne
   - `order: 1` pour positionnement explicite

3. **`.btn-guess` et `.btn-joker`**
   - `flex: 1 1 calc(50% - .2rem)` pour partager équitablement la deuxième ligne
   - Réduction du padding à `.65rem .8rem` pour meilleure adaptation
   - Réduction de la police à `.85rem`
   - Order: 2 et 3 pour positionnement explicite

4. **`.joker-meta`**
   - Réduction du font-size à `.75rem` et du gap à `.3rem` pour cohérence mobile

## 🧪 Résultat
- Input prend toute la largeur (première ligne)
- Boutons "Deviner" et "Joker" partagent équitablement la deuxième ligne (~50% chacun)
- Tous les éléments sont cliquables et bien espacés sur petit écran
- Les touches tactiles ont une surface suffisante (minimum 44px de hauteur recommandé)

## 🔄 Compatibilité
- Aucun changement sur desktop (> 600px)
- Amélioration pure de l'accessibilité mobile
- Pas de breaking change
