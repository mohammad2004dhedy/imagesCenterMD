import { getCache, setCache } from "@/lib/cache";
import { containsBannedWords } from "@/utils/contentSafety";
import { searchPexels, searchPixabay, searchUnsplash } from "@/services/imageProviders";
import { addSearchHistory } from "@/services/searchHistoryService";
import { trackEvent } from "@/services/analyticsService";

const providers = {
  all: ["unsplash", "pexels", "pixabay"],
  unsplash: ["unsplash"],
  pexels: ["pexels"],
  pixabay: ["pixabay"],
  illustration: ["pixabay"],
  vector: ["pixabay"],
  dark: ["pixabay"]
};

export async function searchImages({ query, category = "all", count = 12, userId }) {
  const cleanQuery = query.trim();
  if (containsBannedWords(cleanQuery)) {
    const error = new Error("Search contains blocked safety terms.");
    error.code = "CONTENT_BLOCKED";
    throw error;
  }

  const safeCount = Math.min(Math.max(Number(count) || 12, 1), 30);
  const providerList = providers[category] || providers.all;
  const cacheKey = `search:${cleanQuery.toLowerCase()}:${category}:${safeCount}`;
  const cached = await getCache(cacheKey);
  if (cached) {
    await recordSearch({ userId, query: cleanQuery, category, resultCount: cached.results.length, cached: true });
    return { ...cached, cache: { hit: true, key: cacheKey } };
  }

  const perProvider = Math.max(3, Math.ceil(safeCount / providerList.length));
  const results = (
    await Promise.allSettled(
      providerList.map((provider) => runProvider(provider, { query: cleanQuery, count: perProvider, category }))
    )
  )
    .flatMap((entry) => (entry.status === "fulfilled" ? entry.value : []))
    .slice(0, safeCount);

  const payload = {
    query: cleanQuery,
    category,
    providers: providerList,
    results,
    generatedAt: new Date().toISOString()
  };
  await setCache(cacheKey, payload, 900);
  await recordSearch({ userId, query: cleanQuery, category, resultCount: results.length, cached: false });
  return { ...payload, cache: { hit: false, key: cacheKey } };
}

function runProvider(provider, params) {
  if (provider === "unsplash") return searchUnsplash(params);
  if (provider === "pexels") return searchPexels(params);
  return searchPixabay(params);
}

async function recordSearch({ userId, query, category, resultCount, cached }) {
  if (userId) {
    await addSearchHistory({
      userId,
      keyword: query,
      provider: category === "all" ? "brokered" : category,
      category,
      resultCount
    });
  }
  await trackEvent({
    userId,
    event: cached ? "search_cache_hit" : "search",
    provider: category === "all" ? "brokered" : category,
    keyword: query,
    metadata: { resultCount, cloudConcept: "Cloud Service Brokerage" }
  });
}
