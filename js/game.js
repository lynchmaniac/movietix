import { normalize, isClose } from './fuzzy.js';

export const MAX_ERRORS = 50;

// Regex matching a "word" token in French text (letters + accented chars + ligatures)
const WORD_RE = /[a-zA-ZÀ-ÖØ-öø-ÿŒœ]+/g;

// Words shorter than this in the title are auto-revealed (articles, preps…)
const MIN_TARGET_LEN = 3;

let state = {
  title: '',
  extract: '',
  tokens: [],           // { type: 'word'|'nonword', value: string }[]
  targetWords: new Set(), // normalized title words the player must guess
  uniqueWords: new Set(), // all normalized words present in the extract
  guessedWords: new Set(), // normalized words found by the player
  triedWords: new Set(),   // normalized words already tried (found + not-found + close)
  wrongGuesses: [],       // display-form words that were wrong
  errorCount: 0,
};

// ─── Tokenization ─────────────────────────────────────────────────────────────

function tokenize(text) {
  const tokens = [];
  let lastIndex = 0;
  let match;
  WORD_RE.lastIndex = 0;
  while ((match = WORD_RE.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: 'nonword', value: text.slice(lastIndex, match.index) });
    }
    tokens.push({ type: 'word', value: match[0] });
    lastIndex = WORD_RE.lastIndex;
  }
  if (lastIndex < text.length) {
    tokens.push({ type: 'nonword', value: text.slice(lastIndex) });
  }
  return tokens;
}

// ─── Title word extraction ─────────────────────────────────────────────────────

function extractTargetWords(title) {
  // Split on all non-letter characters to get individual words
  const words = title.split(/[^a-zA-ZÀ-ÖØ-öø-ÿŒœ]+/).filter(Boolean);
  const targets = new Set();
  for (const w of words) {
    const n = normalize(w);
    if (n.length >= MIN_TARGET_LEN) targets.add(n);
  }
  return targets;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function startGame(movieData) {
  state = {
    title: movieData.title,
    extract: movieData.extract,
    tokens: tokenize(movieData.extract),
    targetWords: extractTargetWords(movieData.title),
    uniqueWords: new Set(),
    guessedWords: new Set(),
    triedWords: new Set(),
    wrongGuesses: [],
    errorCount: 0,
  };

  // Build the set of all unique normalized words in the extract
  for (const token of state.tokens) {
    if (token.type === 'word') {
      state.uniqueWords.add(normalize(token.value));
    }
  }
}

/**
 * Processes a player's guess.
 * @returns {'too-short'|'already-tried'|'title-word'|'correct'|'close'|'wrong'}
 */
export function makeGuess(word) {
  const norm = normalize(word.trim());

  if (norm.length < 2) return 'too-short';
  if (state.triedWords.has(norm)) return 'already-tried';

  state.triedWords.add(norm);

  // Check if the word exists anywhere in the extract
  if (state.uniqueWords.has(norm)) {
    state.guessedWords.add(norm);
    return state.targetWords.has(norm) ? 'title-word' : 'correct';
  }

  // Check closeness to any unguessed title word
  for (const target of state.targetWords) {
    if (!state.guessedWords.has(target) && isClose(norm, target)) {
      return 'close';
    }
  }

  // Wrong guess
  state.errorCount++;
  state.wrongGuesses.push(word.trim());
  return 'wrong';
}

export function isWon() {
  if (state.targetWords.size === 0) return false;
  for (const w of state.targetWords) {
    if (!state.guessedWords.has(w)) return false;
  }
  return true;
}

export function isLost() {
  return state.errorCount >= MAX_ERRORS;
}

// ─── Rendering helpers ─────────────────────────────────────────────────────────

/**
 * Returns an HTML string for the article extract.
 * Masked words shown as underscores (length preserved).
 * Guessed words revealed; title words highlighted in gold.
 */
export function renderExtract() {
  return state.tokens.map(token => {
    if (token.type === 'nonword') {
      return escapeHtml(token.value);
    }
    const norm = normalize(token.value);
    if (state.guessedWords.has(norm)) {
      const cls = state.targetWords.has(norm) ? 'word revealed title-hit' : 'word revealed';
      return `<span class="${cls}">${escapeHtml(token.value)}</span>`;
    }
    const blanks = '–'.repeat(token.value.length);
    return `<span class="word masked" aria-label="mot caché">${blanks}</span>`;
  }).join('');
}

/**
 * Returns an array of { text, masked } objects for the title display.
 * One entry per space-separated chunk of the original title.
 */
export function getTitleChunks() {
  // We split on spaces but keep apostrophe-joined parts together visually
  const chunks = state.title.split(' ');
  return chunks.map(chunk => {
    // A chunk may contain apostrophes: "d'Amélie" → treat whole chunk
    const words = chunk.split(/[^a-zA-ZÀ-ÖØ-öø-ÿŒœ]+/).filter(Boolean);
    const masked = words.some(w => {
      const n = normalize(w);
      return n.length >= MIN_TARGET_LEN && !state.guessedWords.has(n);
    });
    const found = words.every(w => {
      const n = normalize(w);
      return n.length < MIN_TARGET_LEN || state.guessedWords.has(n);
    });
    return { text: chunk, masked: !found };
  });
}

export function getErrorCount() { return state.errorCount; }
export function getWrongGuesses() { return [...state.wrongGuesses]; }
export function getTitle() { return state.title; }
export function getTargetWords() { return new Set(state.targetWords); }
export function getGuessedWords() { return new Set(state.guessedWords); }

// ─── Utility ──────────────────────────────────────────────────────────────────

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
