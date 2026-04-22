/**
 * Win and lose animations for Movietix.
 * Pure CSS + vanilla JS — no dependencies.
 */

const CONFETTI_COLORS = [
  '#c9a227', '#f0d070', '#e8c84a',  // golds
  '#e05252', '#f07070',              // reds
  '#52a0e0', '#70c0f0',              // blues
  '#52c080', '#70e0a0',              // greens
  '#c052c0', '#e070e0',              // purples
];

// ─── Win animation ─────────────────────────────────────────────────────────────

export function playWinAnimation(container) {
  container.innerHTML = '';
  const count = 120;

  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';

    const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    const left = Math.random() * 100;
    const delay = Math.random() * 2.5;
    const duration = 2.5 + Math.random() * 2;
    const size = 6 + Math.random() * 10;
    const rotation = Math.random() * 360;
    const shape = Math.random() > 0.5 ? '50%' : '2px'; // circle or square

    Object.assign(piece.style, {
      left: `${left}%`,
      top: '-20px',
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: color,
      borderRadius: shape,
      animationDelay: `${delay}s`,
      animationDuration: `${duration}s`,
      transform: `rotate(${rotation}deg)`,
    });

    container.appendChild(piece);
  }

  // Spotlight pulses
  const spotlight = document.querySelector('#screen-win .win-spotlight');
  if (spotlight) {
    spotlight.style.animationPlayState = 'running';
  }
}

export function clearWinAnimation(container) {
  if (container) container.innerHTML = '';
}

// ─── Lose animation ────────────────────────────────────────────────────────────

export function playLoseAnimation(cardEl) {
  if (!cardEl) return;
  cardEl.classList.remove('animate-lose');
  // Force reflow to restart animation
  void cardEl.offsetWidth;
  cardEl.classList.add('animate-lose');
}

export function clearLoseAnimation(cardEl) {
  if (cardEl) cardEl.classList.remove('animate-lose');
}
