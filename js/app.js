import { getRandomMovie } from './wikipedia.js';
import {
  startGame, makeGuess, isWon, isLost,
  renderExtract, getTitleChunks,
  getErrorCount, getWrongGuesses, getTitle, getExtract,
  MAX_ERRORS,
} from './game.js';
import { playWinAnimation, clearWinAnimation, playLoseAnimation } from './animations.js';

// ─── DOM refs ──────────────────────────────────────────────────────────────────

const screens = {
  home:    document.getElementById('screen-home'),
  loading: document.getElementById('screen-loading'),
  game:    document.getElementById('screen-game'),
  win:     document.getElementById('screen-win'),
  lose:    document.getElementById('screen-lose'),
};

const els = {
  btnPlay:       document.getElementById('btn-play'),
  btnGuess:      document.getElementById('btn-guess'),
  btnReplayWin:  document.getElementById('btn-replay-win'),
  btnReplayLose: document.getElementById('btn-replay-lose'),
  guessInput:    document.getElementById('guess-input'),
  feedback:      document.getElementById('feedback'),
  articleText:   document.getElementById('article-text'),
  titleDisplay:  document.getElementById('title-display'),
  errorFill:     document.getElementById('error-fill'),
  errorLabel:    document.getElementById('error-label'),
  wrongGuesses:  document.getElementById('wrong-guesses'),
  winMovieTitle: document.getElementById('win-movie-title'),
  winStats:      document.getElementById('win-stats'),
  winExtract:    document.getElementById('win-extract'),
  loseMovieTitle:document.getElementById('lose-movie-title'),
  loseStats:     document.getElementById('lose-stats'),
  loseExtract:   document.getElementById('lose-extract'),
  confetti:      document.getElementById('confetti-container'),
  loseCard:      document.getElementById('lose-card'),
};

// ─── Screen navigation ─────────────────────────────────────────────────────────

function showScreen(name) {
  for (const [key, el] of Object.entries(screens)) {
    el.classList.toggle('active', key === name);
  }
}

// ─── Game flow ─────────────────────────────────────────────────────────────────

async function startNewGame() {
  showScreen('loading');
  clearWinAnimation(els.confetti);

  try {
    const movie = await getRandomMovie();
    startGame(movie);
  } catch (err) {
    alert(`⚠️ ${err.message}`);
    showScreen('home');
    return;
  }

  els.guessInput.value = '';
  hideFeedback();
  updateGameUI();
  showScreen('game');
  els.guessInput.focus();
}

function updateGameUI() {
  // Article text
  els.articleText.innerHTML = renderExtract();

  // Title display
  const chunks = getTitleChunks();
  els.titleDisplay.innerHTML = chunks.map(({ text, masked }) => {
    if (masked) {
      // Show underscores matching the "word" characters; keep non-letter chars
      const blanked = text.replace(/[a-zA-ZÀ-ÖØ-öø-ÿŒœ]+/g, m => '–'.repeat(m.length));
      return `<span class="title-chunk masked-chunk" aria-label="mot caché">${blanked}</span>`;
    }
    return `<span class="title-chunk found-chunk">${escapeHtml(text)}</span>`;
  }).join('<span class="title-space"> </span>');

  // Error counter
  const errors = getErrorCount();
  const pct = (errors / MAX_ERRORS) * 100;
  els.errorFill.style.width = `${pct}%`;
  els.errorLabel.textContent = `${errors} / ${MAX_ERRORS}`;
  if (pct > 70) els.errorFill.classList.add('danger');
  else if (pct > 40) els.errorFill.classList.add('warning');
  else els.errorFill.classList.remove('danger', 'warning');

  // Wrong guesses
  const wrong = getWrongGuesses();
  els.wrongGuesses.innerHTML = wrong.length
    ? wrong.map(w => `<span class="wrong-badge">${escapeHtml(w)}</span>`).join('')
    : '';
}

// ─── Guess handling ────────────────────────────────────────────────────────────

function handleGuess() {
  const raw = els.guessInput.value.trim();
  if (!raw) return;

  const result = makeGuess(raw);
  els.guessInput.value = '';
  els.guessInput.focus();

  showFeedback(result, raw);
  updateGameUI();

  if (isWon()) {
    setTimeout(() => showWin(), 800);
  } else if (isLost()) {
    setTimeout(() => showLose(), 800);
  }
}

// ─── Feedback messages ─────────────────────────────────────────────────────────

const FEEDBACK = {
  'too-short':    { type: 'info',    icon: '💬', text: 'Trop court — saisissez au moins 2 lettres.' },
  'already-tried':{ type: 'info',    icon: '🔁', text: 'Vous avez déjà essayé ce mot !' },
  'title-word':   { type: 'success', icon: '🌟', text: 'Mot du titre trouvé ! Excellent !' },
  'correct':      { type: 'success', icon: '✅', text: 'Ce mot est dans le texte !' },
  'close':        { type: 'close',   icon: '🔥', text: 'Vous brûlez… essayez une variante !' },
  'wrong':        { type: 'error',   icon: '❌', text: 'Ce mot n\'est pas dans le texte.' },
};

let feedbackTimer = null;

function showFeedback(result, word) {
  const def = FEEDBACK[result] || FEEDBACK['wrong'];
  els.feedback.className = `feedback feedback-${def.type}`;
  els.feedback.textContent = `${def.icon} ${def.text}`;
  els.feedback.hidden = false;

  clearTimeout(feedbackTimer);
  feedbackTimer = setTimeout(hideFeedback, result === 'close' ? 3000 : 2000);
}

function hideFeedback() {
  els.feedback.hidden = true;
}

// ─── End screens ───────────────────────────────────────────────────────────────

function showWin() {
  const errors = getErrorCount();
  const title = getTitle();
  const extract = getExtract();
  els.winMovieTitle.textContent = `« ${title} »`;
  els.winStats.textContent = errors === 0
    ? 'Parfait — aucune erreur !'
    : `${errors} erreur${errors > 1 ? 's' : ''} commise${errors > 1 ? 's' : ''}.`;
  els.winExtract.textContent = extract;

  showScreen('win');
  playWinAnimation(els.confetti);
}

function showLose() {
  const errors = getErrorCount();
  const title = getTitle();
  const extract = getExtract();
  els.loseMovieTitle.textContent = `« ${title} »`;
  els.loseStats.textContent = `${errors} erreurs — fin de partie.`;
  els.loseExtract.textContent = extract;

  showScreen('lose');
  playLoseAnimation(els.loseCard);
}

// ─── Event listeners ───────────────────────────────────────────────────────────

els.btnPlay.addEventListener('click', startNewGame);
els.btnReplayWin.addEventListener('click', startNewGame);
els.btnReplayLose.addEventListener('click', startNewGame);

els.btnGuess.addEventListener('click', handleGuess);
els.guessInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') handleGuess();
});

// ─── Utility ──────────────────────────────────────────────────────────────────

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
