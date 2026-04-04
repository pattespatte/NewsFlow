import { NextResponse } from 'next/server';
import { NEWS_SOURCES } from '@/lib/sources';
import { parseRssFeed } from '@/lib/rss';
import { RSS_CONSTANTS, ALL_SOURCES_ID } from '@/lib/constants';
import type { Article, RSSResponse } from '@/types/article';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Use constants from @/lib/constants
const { CACHE_TTL, FETCH_TIMEOUT, MIN_XML_LENGTH, MAX_ARTICLES } = RSS_CONSTANTS;

interface CacheEntry {
  data: { articles: Article[]; error?: string };
  timestamp: number;
}

const feedCache = new Map<string, CacheEntry>();

function getCachedFeed(url: string): CacheEntry | null {
  const entry = feedCache.get(url);
  if (!entry) return null;

  const now = Date.now();
  if (now - entry.timestamp > CACHE_TTL) {
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

function createErrorResponse(error: string, timing: number): { articles: Article[]; error: string; timing: number } {
  return { articles: [], error, timing };
}

async function fetchFeed(url: string, sourceId: string): Promise<{ articles: Article[]; error?: string; timing?: number }> {
  const startTime = Date.now();
  const source = NEWS_SOURCES.find(s => s.id === sourceId);
  if (!source) {
    return { articles: [], error: 'Unknown source', timing: 0 };
  }

  const cached = getCachedFeed(url);
  if (cached) {
    return { ...cached.data, timing: Date.now() - startTime };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
        'User-Agent': 'Mozilla/5.0 (compatible; NewsFlowRSS/1.0)',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const timing = Date.now() - startTime;
      const errorData = createErrorResponse(`HTTP ${response.status}`, timing);
      setCachedFeed(url, { articles: [], error: errorData.error });
      return errorData;
    }

    const xml = await response.text();

    if (!xml || xml.length < MIN_XML_LENGTH) {
      const timing = Date.now() - startTime;
      const errorData = createErrorResponse('Empty response', timing);
      setCachedFeed(url, { articles: [], error: errorData.error });
      return errorData;
    }

    const articles = await parseRssFeed(xml, source);
    const timing = Date.now() - startTime;
    const result = { articles, timing };

    setCachedFeed(url, { articles });

    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const timing = Date.now() - startTime;
    const errorData = createErrorResponse(message, timing);
    setCachedFeed(url, { articles: [], error: errorData.error }); // Cache without timing
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
  const sourcesToFetch = sourceId && sourceId !== ALL_SOURCES_ID
    ? NEWS_SOURCES.filter(s => s.id === sourceId)
    : NEWS_SOURCES;

  if (sourcesToFetch.length === 0) {
    response.errors.push(`Source "${sourceId}" not found`);
    return NextResponse.json(response);
  }

  const fetchPromises = sourcesToFetch.map(async (source) => {
    const result = await fetchFeed(source.url, source.id);
    if (result.error) {
      response.errors.push(`${source.name}: ${result.error}`);
    }
    return { source, result };
  });

  try {
    const results = await Promise.all(fetchPromises);

    response.sourceTimings = results.map(({ source, result }) => ({
      sourceId: source.id,
      sourceName: source.name,
      timing: result.timing || 0,
      articleCount: result.articles.length,
    }));

    // Combine all articles and deduplicate by URL
    const seenUrls = new Map<string, Article>();
    for (const { result } of results) {
      for (const article of result.articles) {
        if (!seenUrls.has(article.link)) {
          seenUrls.set(article.link, article);
        }
      }
    }

    // Sort by date (newest first), parsing dates once
    const sorted = Array.from(seenUrls.values());
    const timestamps = new Map(sorted.map(a => [a.link, new Date(a.pubDate).getTime()]));
    sorted.sort((a, b) => timestamps.get(b.link)! - timestamps.get(a.link)!);

    response.articles = sorted.slice(0, MAX_ARTICLES);

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch feeds';
    response.errors.push(message);
  }

  return NextResponse.json(response, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
