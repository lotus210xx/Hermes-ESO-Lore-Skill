// Thin client for the UESP (uesp.net) MediaWiki API — the community-run
// Elder Scrolls encyclopedia. ESO-specific lore lives in the "Lore:" namespace
// (ns 130), which is what makes it usable for a lore-focused bot instead of
// generic gameplay pages.
const BASE_URL = 'https://en.uesp.net/w/api.php';
const LORE_NAMESPACE = 130;
const USER_AGENT = 'ESOLoreDiscordBot/1.0 (contact: discord bot owner)';

async function apiGet(params) {
  const url = new URL(BASE_URL);
  url.search = new URLSearchParams({ format: 'json', formatversion: '2', ...params }).toString();
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok) throw new Error(`UESP API request failed: ${res.status}`);
  return res.json();
}

// Finds the best-matching Lore: page title for a search term.
async function findLoreTitle(query) {
  const data = await apiGet({
    action: 'query',
    list: 'search',
    srsearch: query,
    srnamespace: LORE_NAMESPACE,
    srlimit: 1,
  });
  const hit = data.query?.search?.[0];
  return hit ? hit.title : null;
}

// Fetches a plain-text extract + thumbnail + canonical URL for a Lore: page title.
async function getLorePage(title) {
  const data = await apiGet({
    action: 'query',
    prop: 'extracts|pageimages|info',
    exchars: 1200,
    explaintext: 1,
    piprop: 'original',
    inprop: 'url',
    titles: title,
  });
  const page = data.query?.pages?.[0];
  if (!page || page.missing) return null;
  return {
    title: page.title,
    extract: page.extract || 'No summary available for this entry.',
    image: page.original?.source || null,
    url: page.fullurl || `https://en.uesp.net/wiki/${encodeURIComponent(page.title.replace(/ /g, '_'))}`,
  };
}

// Convenience: search + fetch in one call. Returns null if nothing matched.
async function lookupLore(query) {
  const title = await findLoreTitle(query);
  if (!title) return null;
  return getLorePage(title);
}

// A random article from the Lore: namespace, for a "surprise me" command.
async function randomLore() {
  const data = await apiGet({
    action: 'query',
    list: 'random',
    rnnamespace: LORE_NAMESPACE,
    rnlimit: 1,
  });
  const title = data.query?.random?.[0]?.title;
  if (!title) return null;
  return getLorePage(title);
}

module.exports = { lookupLore, randomLore, getLorePage, findLoreTitle };
