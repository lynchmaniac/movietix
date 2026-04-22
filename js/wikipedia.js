import { MOVIES } from '../data/movies.js';

const API_BASE = 'https://fr.wikipedia.org/api/rest_v1/page/summary/';

/**
 * Fetches the summary of a French Wikipedia page by slug.
 * @returns {{ title: string, extract: string, slug: string }}
 */
async function fetchSummary(slug) {
  const url = API_BASE + encodeURIComponent(slug);
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`Wikipedia API error ${res.status} for "${slug}"`);
  const data = await res.json();
  if (!data.extract || data.extract.trim().length < 50) {
    throw new Error(`Extract too short for "${slug}"`);
  }
  return {
    title: data.title,
    extract: data.extract,
    slug,
  };
}

/**
 * Picks a random movie from the list, fetches its Wikipedia summary.
 * Retries up to `maxRetries` times on failure to handle bad slugs.
 */
export async function getRandomMovie(maxRetries = 5) {
  const shuffled = [...MOVIES].sort(() => Math.random() - 0.5);
  for (let i = 0; i < Math.min(maxRetries, shuffled.length); i++) {
    try {
      return await fetchSummary(shuffled[i]);
    } catch (e) {
      console.warn(`[wikipedia] Retrying after error: ${e.message}`);
    }
  }
  throw new Error('Impossible de charger un film depuis Wikipedia. Vérifiez votre connexion.');
}
