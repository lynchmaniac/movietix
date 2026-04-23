import { MOVIES } from '../data/movies.js';

const API_SUMMARY = 'https://fr.wikipedia.org/api/rest_v1/page/summary/';
const API_HTML = 'https://fr.wikipedia.org/api/rest_v1/page/html/';

/**
 * Extracts first two paragraphs from HTML content.
 * Filters out navigation, infobox, and other non-body elements.
 */
function extractTwoParagraphs(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // Get all paragraph tags, filter out those inside nav, figure, infobox, etc.
  const paragraphs = Array.from(doc.querySelectorAll('p')).filter(p => {
    const parent = p.closest('nav, figure, aside, .infobox, .navbox, .metadata');
    return !parent;
  });

  // Take first two paragraphs and extract text
  const text = paragraphs
    .slice(0, 2)
    .map(p => p.textContent)
    .join('\n\n');

  return text.trim();
}

/**
 * Fetches the title and first two paragraphs of a French Wikipedia page by slug.
 * Falls back to summary API if HTML parsing fails.
 * @returns {{ title: string, extract: string, slug: string }}
 */
async function fetchPageContent(slug) {
  try {
    // Try to fetch full HTML and extract 2 paragraphs
    const htmlUrl = API_HTML + encodeURIComponent(slug);
    const htmlRes = await fetch(htmlUrl, { headers: { Accept: 'application/json' } });
    
    if (htmlRes.ok) {
      const htmlData = await htmlRes.json();
      const extract = extractTwoParagraphs(htmlData.html);
      
      if (extract && extract.length >= 100) {
        // Successfully extracted 2 good paragraphs
        return {
          title: htmlData.title,
          extract: extract,
          slug,
        };
      }
    }
  } catch (e) {
    console.warn(`[wikipedia] Failed to fetch HTML for "${slug}":`, e.message);
  }

  // Fallback to summary API
  try {
    const summaryUrl = API_SUMMARY + encodeURIComponent(slug);
    const summaryRes = await fetch(summaryUrl, { headers: { Accept: 'application/json' } });
    if (!summaryRes.ok) throw new Error(`Wikipedia API error ${summaryRes.status} for "${slug}"`);
    const data = await summaryRes.json();
    if (!data.extract || data.extract.trim().length < 50) {
      throw new Error(`Extract too short for "${slug}"`);
    }
    return {
      title: data.title,
      extract: data.extract,
      slug,
    };
  } catch (e) {
    throw new Error(`Failed to fetch content for "${slug}": ${e.message}`);
  }
}

/**
 * Picks a random movie from the list, fetches its Wikipedia content.
 * Retries up to `maxRetries` times on failure to handle bad slugs.
 */
export async function getRandomMovie(maxRetries = 5) {
  const shuffled = [...MOVIES].sort(() => Math.random() - 0.5);
  for (let i = 0; i < Math.min(maxRetries, shuffled.length); i++) {
    try {
      return await fetchPageContent(shuffled[i]);
    } catch (e) {
      console.warn(`[wikipedia] Retrying after error: ${e.message}`);
    }
  }
  throw new Error('Impossible de charger un film depuis Wikipedia. Vérifiez votre connexion.');
}
