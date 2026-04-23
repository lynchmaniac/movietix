# Feature: Afficher les 2 premiers paragraphes de l'article au lieu d'un seul

## 🎯 Problème
Actuellement, seul un extrait résumé court est affiché. Cela ne suffit pas pour bien comprendre l'histoire du film. L'utilisateur doit deviner en ayant très peu d'informations sur le scénario.

## ✅ Solution
Augmenter le contenu affiché en extrayant les **2 premiers vrais paragraphes** de l'article Wikipedia au lieu d'un seul résumé générique.

### Impact
- **Avant:** 1 court résumé générique (~300 caractères)
- **Après:** 2 paragraphes complets (~700-1000 caractères)
- Meilleure compréhension de l'histoire du film
- Plus d'informations pour faire des déductions

## 🔧 Modifications

### `js/wikipedia.js`

**Nouvelles API et fonctions:**

1. **Deux endpoints Wikipedia API:**
   - `API_HTML` : `/page/html/` pour récupérer le contenu complet en HTML
   - `API_SUMMARY` : `/page/summary/` comme fallback

2. **`extractTwoParagraphs(html)`** (nouvelle fonction)
   - Parse le HTML récupéré depuis Wikipedia
   - Extrait les 2 premiers paragraphes `<p>`
   - Filtre les éléments parasites (nav, infobox, figure, aside)
   - Retourne le texte brut avec double saut de ligne entre paragraphes

3. **`fetchPageContent(slug)`** (remplace `fetchSummary`)
   - Essaie d'abord de récupérer le contenu HTML et d'extraire 2 paragraphes
   - Si succès (extrait ≥ 100 caractères), retourne les 2 paragraphes
   - Si échec, fallback sur l'API summary (ancien comportement)
   - Gère les erreurs réseau et API gracefully

4. **`getRandomMovie()`** (updated)
   - Appelle maintenant `fetchPageContent()` au lieu de `fetchSummary()`
   - Reste identique dans sa logique (retry, shuffling)

## 📊 Exemple

**Film: "Intouchables"**

**Avant (1 résumé court):**
```
Intouchables est un film français réalisé par Olivier Nakache et Éric Toledano.
Il raconte l'histoire d'une amitié improbable entre un homme riche paralysé et son 
aide-soignant de quartier. Le film explore les thèmes de l'amitié, de la classe 
sociale et de la rédemption.
```

**Après (2 vrais paragraphes):**
```
Le film est l'histoire vraie de la relation entre Philippe, un aristocrate 
riche devenu tétraplégique après un accident de parapente, et Driss, un jeune 
homme issu d'un quartier difficile qui ne cherchait qu'un boulot facile. 
Engagé comme aide-soignant, Driss apporte une perspective totalement nouvelle 
sur la vie de Philippe.

Entre l'humour, la tendresse et les regards croisés sur leurs mondes opposés, 
une amitié sincère naît entre les deux hommes. Le film montre comment chacun 
transforme la vie de l'autre, redonnant à Philippe le goût de vivre et offrant 
à Driss des perspectives qu'il n'aurait jamais imaginées.
```
```

## 🧪 Test manuel

1. **Lancer une nouvelle partie**
2. **Vérifier la longueur du texte:** Deux paragraphes visibles au lieu d'un court résumé
3. **Vérifier la qualité:** Le contenu raconte réellement l'histoire du film
4. **Vérifier plusieurs films:** Choisir différents films pour voir l'amélioration
5. **Offline/Error handling:** Si Wikipedia est down, le fallback sur summary API fonctionne

## 🔄 Compatibilité

- **Fallback automatique** si l'API HTML échoue (maintient robustesse)
- **Aucun changement HTML/CSS** (architecture identique)
- **Backwards compatible** (si la nouvelle API échoue, ancien comportement)
- **Non-breaking:** Les autres modules reçoivent exactement la même structure

## 📈 Performance

- **Cache Wikipedia:** Les API Wikipedia retournent du cache navigateur
- **Parsing DOM:** Très rapide sur navigateur (quelques ms)
- **Champ `extract` plus long:** Aucun impact sur performance du jeu (texte statique)

## 🎯 Avantages UX

✅ Plus de contexte pour deviner le titre  
✅ Vrai contenu Wikipedia (pas de résumé artificiel)  
✅ Découverte meilleure des films  
✅ Reste accessible sur mobile  
✅ Fonctionnalité additive (pas de breaking change)
