/**
 * Fuzzy matching utilities for French text.
 * Handles accent normalization and Levenshtein distance.
 */

/**
 * Normalizes a word for comparison:
 * - lowercased
 * - diacritics removed (é→e, à→a, etc.)
 * - apostrophes and hyphens stripped
 */
export function normalize(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip combining diacritics
    .replace(/['\u2019\u2018`]/g, '') // strip apostrophes
    .replace(/-/g, ''); // strip hyphens
}

/**
 * Computes the Levenshtein edit distance between two strings.
 */
export function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => i);
  for (let j = 1; j <= n; j++) {
    let prev = dp[0];
    dp[0] = j;
    for (let i = 1; i <= m; i++) {
      const temp = dp[i];
      dp[i] = a[i - 1] === b[j - 1]
        ? prev
        : 1 + Math.min(prev, dp[i], dp[i - 1]);
      prev = temp;
    }
  }
  return dp[m];
}

/**
 * Returns true if `guess` is "close" to `target` (but not equal).
 * Threshold: Levenshtein distance ≤ 2 on normalized forms.
 * Also requires the guess is at least 3 chars to avoid spurious matches.
 */
export function isClose(guessNorm, targetNorm) {
  if (guessNorm === targetNorm) return false;
  if (guessNorm.length < 3 || targetNorm.length < 3) return false;
  return levenshtein(guessNorm, targetNorm) <= 2;
}
