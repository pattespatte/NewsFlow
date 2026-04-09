import { STORAGE_KEYS } from './constants';
import type { Article, SourceTiming } from '@/types/article';

const MAX_CACHED_ARTICLES = 200;

interface CachedData {
  articles: Article[];
  lastUpdated: string | null;
  sourceTimings: SourceTiming[];
}

export function getCachedArticles(): CachedData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ARTICLES_CACHE);
    if (!raw) return null;
    const data = JSON.parse(raw) as CachedData;
    if (!Array.isArray(data.articles) || data.articles.length === 0) return null;
    return data;
  } catch {
    return null;
  }
}

export function setCachedArticles(
  articles: Article[],
  lastUpdated: string | null,
  sourceTimings: SourceTiming[],
): void {
  try {
    const data: CachedData = {
      articles: articles.slice(0, MAX_CACHED_ARTICLES),
      lastUpdated,
      sourceTimings,
    };
    localStorage.setItem(STORAGE_KEYS.ARTICLES_CACHE, JSON.stringify(data));
  } catch {
    // localStorage full or unavailable — silently ignore
  }
}

export function clearArticleCache(): void {
  localStorage.removeItem(STORAGE_KEYS.ARTICLES_CACHE);
}
