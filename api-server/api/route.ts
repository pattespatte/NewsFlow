import { NextResponse } from 'next/server';
import { NEWS_SOURCES } from '../src/lib/sources';
import { parseRssFeed } from '../src/lib/rss';
import { RSS_CONSTANTS } from '../src/lib/constants';
import type { Article, RSSResponse } from '../src/types/article';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
interface CacheEntry {
  data: { articles: Article[]; error?: string };
  timestamp: number;
}

const feedCache = new Map<string, CacheEntry>();

function getCachedFeed(url: string): CacheEntry | null {
  const entry = feedCache.get(url);
  if (!entry) return null;

  const now = Date.now();
  if (now - entry.timestamp > RSS_CONSTANTS.CACHE_TTL) {
    feedCache.delete(url);
    return null;
  }

  return entry;
}

function setCachedFeed(url: string, data: { articles: Article[]; error?: string }) {
  feedCache.set(url, {
    data,
    timestamp: Date.now(),
  });
}

async function fetchFeed(url: string, sourceId: string): Promise<{ articles: Article[]; error?: string }> {
  // Validate source before fetching (TOCTOU fix)
  const source = NEWS_SOURCES.find(s => s.id === sourceId);
  if (!source) {
    const errorData = { articles: [], error: 'Unknown source' };
    return errorData;
  }

  // Check cache first
  const cached = getCachedFeed(url);
  if (cached) {
    return cached.data;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), RSS_CONSTANTS.FETCH_TIMEOUT);

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
        'User-Agent': 'Mozilla/5.0 (compatible; NewsFlowRSS/1.0)',
      },
      signal: controller.signal,
      next: { revalidate: 300 }, // Cache for 5 minutes at Next.js level too
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = { articles: [], error: `HTTP ${response.status}` };
      setCachedFeed(url, errorData);
      return errorData;
    }

    const xml = await response.text();

    if (!xml || xml.length < RSS_CONSTANTS.MIN_XML_LENGTH) {
      const errorData = { articles: [], error: 'Empty response' };
      setCachedFeed(url, errorData);
      return errorData;
    }

    const articles = parseRssFeed(xml, source);
    const result = { articles };

    // Cache the result
    setCachedFeed(url, result);

    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const errorData = { articles: [], error: message };
    setCachedFeed(url, errorData);
    return errorData;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sourceId = searchParams.get('source');

  const response: RSSResponse = {
    articles: [],
    errors: [],
    lastUpdated: new Date().toISOString(),
  };

  // Determine which sources to fetch
  const sourcesToFetch = sourceId && sourceId !== 'all'
    ? NEWS_SOURCES.filter(s => s.id === sourceId)
    : NEWS_SOURCES;

  if (sourcesToFetch.length === 0) {
    response.errors.push(`Source "${sourceId}" not found`);
    return NextResponse.json(response);
  }

  // Fetch all feeds in parallel
  const fetchPromises = sourcesToFetch.map(async (source) => {
    const result = await fetchFeed(source.url, source.id);
    if (result.error) {
      response.errors.push(`${source.name}: ${result.error}`);
    }
    return result.articles;
  });

  try {
    const results = await Promise.all(fetchPromises);

    // Combine all articles and deduplicate by URL
    const seenUrls = new Map<string, Article>();
    for (const articles of results) {
      for (const article of articles) {
        // Use the article URL as the unique key
        if (!seenUrls.has(article.link)) {
          seenUrls.set(article.link, article);
        }
      }
    }

    // Convert back to array and sort by date (newest first)
    response.articles = Array.from(seenUrls.values());
    response.articles.sort((a, b) => b.pubDate.localeCompare(a.pubDate));

    // Limit to max articles
    response.articles = response.articles.slice(0, RSS_CONSTANTS.MAX_ARTICLES);

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch feeds';
    response.errors.push(message);
  }

  // Set cache headers
  return NextResponse.json(response, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=150',
    },
  });
}
