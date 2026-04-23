# PR: Ajout de 3 jokers par partie

## 🎯 Objectif
Introduire un système de jokers limité à 3 utilisations par partie.
Chaque joker révèle automatiquement un mot aléatoire du résumé Wikipedia, sans jamais révéler un mot appartenant au titre du film.

## 📝 Description
Cette PR ajoute une mécanique d'aide contrôlée pour fluidifier les parties sans casser la difficulté principale:
- Le joueur dispose de **3 jokers maximum** par partie.
- Un clic sur Joker révèle **un mot aléatoire non encore découvert** dans le résumé.
- Les jokers **n'affectent jamais les mots du titre** (aucune triche possible sur l'objectif principal).
- Une fois les 3 jokers consommés, le bouton est désactivé et un feedback dédié est affiché.
- Les jokers sont **réinitialisés automatiquement à chaque nouvelle partie**.

## 🔧 Modifications

### 1. `js/game.js`
- Ajout de la constante `MAX_JOKERS = 3`.
- Extension de l'état de partie avec `jokersLeft`.
- Réinitialisation de `jokersLeft` dans `startGame()`.
- Ajout de `useJoker()`:
  - Vérifie s'il reste des jokers.
  - Sélectionne aléatoirement un mot éligible du résumé.
  - Exclut systématiquement les mots du titre.
  - Révèle le mot choisi et décrémente le compteur.
- Ajout de `getJokersLeft()` pour l'affichage UI.

### 2. `index.html`
- Ajout d'un bouton `Joker` dans la zone de saisie.
- Ajout d'un indicateur visuel `Jokers restants : X / 3`.

### 3. `js/app.js`
- Import de `useJoker`, `getJokersLeft` et `MAX_JOKERS`.
- Ajout des références DOM `btnJoker` et `jokerLabel`.
- Mise à jour de `updateGameUI()`:
  - Affiche le compteur de jokers.
  - Désactive le bouton quand il n'y a plus de joker.
- Ajout du handler `handleJoker()`.
- Ajout des messages de feedback:
  - `revealed`
  - `no-jokers-left`
  - `no-eligible-word`

### 4. `css/style.css`
- Style du bouton joker (`.btn-joker`) aligné avec le thème existant.
- Style d'état désactivé (`.btn-joker:disabled`).
- Ajout du bloc d'information joker (`.joker-meta`, `.joker-label`, `.joker-count`).

## ✅ Règles respectées
- Le joker révèle un mot du résumé: **oui**.
- Le joker ne révèle pas de mot du titre: **oui**.
- Maximum 3 jokers par partie: **oui**.
- Blocage après 3 jokers: **oui**.
- Reset des jokers à chaque nouvelle partie: **oui**.

## 🧪 Test manuel
1. Lancer une nouvelle partie: le compteur affiche `3 / 3`.
2. Cliquer sur Joker une fois: un mot non-titre du résumé est révélé, compteur `2 / 3`.
3. Répéter jusqu'à `0 / 3`: bouton Joker désactivé.
4. Vérifier que les mots du titre restent masqués tant qu'ils ne sont pas devinés manuellement.
5. Rejouer une partie: compteur de jokers réinitialisé à `3 / 3`.

## 🔄 Impact
- Pas de breaking change.
- Fonctionnalité additive.
- Difficulté du jeu conservée sur l'objectif principal (découverte du titre).

---

**Branche:** `feature/add-3-jokers`
