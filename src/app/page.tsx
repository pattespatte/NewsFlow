'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { SourceTabs } from '@/components/SourceTabs';
import { ArticleCard } from '@/components/ArticleCard';
import { SourceCarousel } from '@/components/SourceCarousel';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Newspaper, RefreshCw, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { matchesSearch } from '@/lib/utils';
import { API_URL, STORAGE_KEYS, ALL_SOURCES_ID, TIMING_THRESHOLDS, TIMING_COLORS, getTimingColor } from '@/lib/constants';
import { getSourceById, ALL_NEWS_SOURCE, NEWS_SOURCES } from '@/lib/sources';
import { getCachedArticles, setCachedArticles, clearArticleCache } from '@/lib/cache';
import { ClientTime } from '@/components/ClientTime';
import type { Article, RSSResponse, SourceTiming } from '@/types/article';

// Redirect GitHub Pages to Vercel (serverless API required)
const PRODUCTION_URL = 'https://newsflow-rss-reader.vercel.app';
const isGitHubPages = typeof window !== 'undefined' && window.location.hostname === 'pattespatte.github.io';

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [bookmarks, setBookmarks] = useState<Article[]>([]);
  const [activeSource, setActiveSource] = useState(ALL_SOURCES_ID);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [sourceTimings, setSourceTimings] = useState<SourceTiming[]>([]);
  const [showTimingDialog, setShowTimingDialog] = useState(false);
  const [disabledSources, setDisabledSources] = useState<Set<string>>(new Set());

  // Redirect GitHub Pages to Vercel (serverless API required)
  useEffect(() => {
    if (isGitHubPages) {
      const currentPath = window.location.pathname.replace(/\/NewsFlow\/?/, '') || '';
      const currentSearch = window.location.search;
      window.location.href = `${PRODUCTION_URL}/${currentPath}${currentSearch}`;
      return;
    }
    // Read source from URL on mount
    const param = new URLSearchParams(window.location.search).get('source');
    if (param && getSourceById(param)) {
      setActiveSource(param);
      // Focus and scroll the matching tab into view
      requestAnimationFrame(() => {
        const btn = document.querySelector(`[data-source-id="${param}"]`) as HTMLElement;
        btn?.scrollIntoView({ behavior: 'instant', inline: 'center', block: 'nearest' });
        btn?.focus();
      });
    }
  }, []);

  const bookmarkIds = useMemo(() => new Set(bookmarks.map(b => b.id)), [bookmarks]);

  // Load bookmarks from localStorage
  useEffect(() => {
    const savedBookmarks = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    if (savedBookmarks) {
      try {
        setBookmarks(JSON.parse(savedBookmarks));
      } catch {
        // Invalid bookmark data, ignore
      }
    }
  }, []);

  // Save bookmarks to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Load disabled sources from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DISABLED_SOURCES);
      if (saved) {
        setDisabledSources(new Set(JSON.parse(saved) as string[]));
      }
    } catch {
      // Invalid data, ignore
    }
  }, []);

  // Save disabled sources to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DISABLED_SOURCES, JSON.stringify([...disabledSources]));
  }, [disabledSources]);

  // Fetch articles progressively — batch sources, show results as each batch completes
  const fetchArticlesProgressively = useCallback(async () => {
    const BATCH_SIZE = 6;
    const allArticles: Article[] = [];
    const allErrors: string[] = [];
    const allTimings: SourceTiming[] = [];

    setIsRefreshing(true);
    setErrors([]);

    for (let i = 0; i < NEWS_SOURCES.length; i += BATCH_SIZE) {
      const batch = NEWS_SOURCES.slice(i, i + BATCH_SIZE);

      const results = await Promise.allSettled(
        batch.map(source =>
          fetch(`${API_URL}/rss?source=${source.id}`)
            .then(r => r.json()) as Promise<RSSResponse>
        )
      );

      for (const result of results) {
        if (result.status === 'fulfilled') {
          const data = result.value;
          allArticles.push(...data.articles);
          if (data.errors) allErrors.push(...data.errors);
          if (data.sourceTimings) allTimings.push(...data.sourceTimings);
        }
      }

      // Deduplicate and sort after each batch so user sees content progressively
      const seenUrls = new Map<string, Article>();
      for (const article of allArticles) {
        if (!seenUrls.has(article.link)) {
          seenUrls.set(article.link, article);
        }
      }
      const merged = Array.from(seenUrls.values());
      merged.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

      setArticles([...merged]);
      setIsLoading(false);
    }

    // Final state update
    const seenUrls = new Map<string, Article>();
    for (const article of allArticles) {
      if (!seenUrls.has(article.link)) {
        seenUrls.set(article.link, article);
      }
    }
    const final = Array.from(seenUrls.values());
    final.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

    const now = new Date().toISOString();
    setArticles(final);
    setErrors(allErrors);
    setLastUpdated(now);
    setSourceTimings(allTimings);
    setIsRefreshing(false);
    setIsLoading(false);

    // Persist to localStorage
    setCachedArticles(final, now, allTimings);

    // Enrich articles missing images (Al Jazeera, Guardian, Deutsche Welle)
    enrichArticleImages(final, now, allTimings);
  }, []);

  // Fetch og:images for articles that lack them (sources like Al Jazeera don't include images in RSS)
  const enrichArticleImages = useCallback(async (
    currentArticles: Article[],
    updatedTime: string,
    timings: SourceTiming[],
  ) => {
    const articlesNeedingImages = currentArticles.filter(a => !a.imageUrl);
    if (articlesNeedingImages.length === 0) return;

    // Process in batches of 10
    const BATCH_SIZE = 10;
    let enrichedArticles = [...currentArticles];

    for (let i = 0; i < articlesNeedingImages.length; i += BATCH_SIZE) {
      const batch = articlesNeedingImages.slice(i, i + BATCH_SIZE);
      const urls = batch.map(a => a.link);

      try {
        const res = await fetch(`${API_URL}/og-image`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ urls }),
        });
        const { images } = await res.json();

        let changed = false;
        enrichedArticles = enrichedArticles.map(article => {
          if (!article.imageUrl && images[article.link]) {
            changed = true;
            return { ...article, imageUrl: images[article.link] };
          }
          return article;
        });

        if (changed) {
          setArticles([...enrichedArticles]);
          setCachedArticles(enrichedArticles, updatedTime, timings);
        }
      } catch {
        // Silently ignore — images will show as placeholders
      }
    }
  }, []);

  // On mount: show cached articles instantly, then fetch fresh in background
  useEffect(() => {
    const cached = getCachedArticles();
    if (cached) {
      setArticles(cached.articles);
      setLastUpdated(cached.lastUpdated);
      setSourceTimings(cached.sourceTimings);
      setIsLoading(false);
      // Enrich cached articles that may be missing images
      enrichArticleImages(cached.articles, cached.lastUpdated || new Date().toISOString(), cached.sourceTimings);
    }
    fetchArticlesProgressively();
  }, [fetchArticlesProgressively, enrichArticleImages]);

  // Handle source change
  const handleSourceChange = useCallback((sourceId: string) => {
    setActiveSource(sourceId);
    setShowBookmarks(false);
    setSearchQuery('');
    // Sync URL without page reload
    const url = new URL(window.location.href);
    if (sourceId === ALL_SOURCES_ID) {
      url.searchParams.delete('source');
    } else {
      url.searchParams.set('source', sourceId);
    }
    window.history.replaceState(null, '', url.toString());
  }, []);

  // Reset to "All News" if the active source gets disabled
  useEffect(() => {
    if (activeSource !== ALL_SOURCES_ID && disabledSources.has(activeSource)) {
      handleSourceChange(ALL_SOURCES_ID);
    }
  }, [disabledSources, activeSource, handleSourceChange]);

  // Toggle bookmark
  const toggleBookmark = useCallback((article: Article) => {
    setBookmarks((prev) => {
      const isBookmarked = prev.some((b) => b.id === article.id);
      if (isBookmarked) {
        return prev.filter((b) => b.id !== article.id);
      } else {
        return [article, ...prev];
      }
    });
  }, []);

  // Check if article is bookmarked - O(1) lookup using Set
  const isBookmarked = useCallback((articleId: string) => {
    return bookmarkIds.has(articleId);
  }, [bookmarkIds]);

  // Toggle bookmarks view
  const handleToggleBookmarks = useCallback(() => {
    setShowBookmarks((prev) => !prev);
    setSearchQuery('');
  }, []);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    if (!showBookmarks) {
      clearArticleCache();
      fetchArticlesProgressively();
    }
  }, [showBookmarks, fetchArticlesProgressively]);

  // Handle search change
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Toggle search on mobile
  const handleToggleSearch = useCallback(() => {
    setShowSearch((prev) => !prev);
  }, []);

  // Toggle a source in the disabled filter
  const toggleSourceFilter = useCallback((sourceId: string) => {
    setDisabledSources(prev => {
      const next = new Set(prev);
      if (next.has(sourceId)) next.delete(sourceId);
      else next.add(sourceId);
      return next;
    });
  }, []);

  // Bulk enable/disable all sources
  const setAllSourceFilters = useCallback((disabled: boolean) => {
    setDisabledSources(disabled ? new Set(NEWS_SOURCES.map(s => s.id)) : new Set());
  }, []);

  // Get display articles (used for search and bookmarks modes)
  const displayArticles = useMemo(() => {
    const base = showBookmarks ? bookmarks : articles;

    // Filter by search query - pre-compute lowercase query once
    const searchFiltered = searchQuery.trim()
      ? (() => {
          const query = searchQuery.toLowerCase();
          return base.filter((a) =>
            matchesSearch(a.title, query) ||
            matchesSearch(a.description, query) ||
            matchesSearch(a.source.name, query)
          );
        })()
      : base;

    // Filter out disabled sources
    return searchFiltered.filter(a => !disabledSources.has(a.source.id));
  }, [showBookmarks, bookmarks, articles, searchQuery, disabledSources]);

  // All sources for the carousel (includes "All News")
  const carouselSources = useMemo(() => [ALL_NEWS_SOURCE, ...NEWS_SOURCES], []);

  // Articles filtered by disabled sources
  const filteredArticles = useMemo(() => {
    return articles.filter(a => !disabledSources.has(a.source.id));
  }, [articles, disabledSources]);

  // Carousel sources excluding disabled ones
  const filteredCarouselSources = useMemo(() => {
    return carouselSources.filter(s => s.id === ALL_SOURCES_ID || !disabledSources.has(s.id));
  }, [carouselSources, disabledSources]);

  const slowSources = useMemo(() => {
    return sourceTimings.filter(t => t.timing > TIMING_THRESHOLDS.FAST);
  }, [sourceTimings]);

  const sortedTimings = useMemo(() => {
    return [...sourceTimings].sort((a, b) => b.timing - a.timing);
  }, [sourceTimings]);

  return (
    <div className="min-h-screen bg-background" suppressHydrationWarning>
      <Header
        showBookmarks={showBookmarks}
        onToggleBookmarks={handleToggleBookmarks}
        onRefresh={handleRefresh}
        isLoading={isLoading || isRefreshing}
        bookmarkCount={bookmarks.length}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onToggleSearch={handleToggleSearch}
        showSearch={showSearch}
        disabledSources={disabledSources}
        onToggleSource={toggleSourceFilter}
        onSetAllSourceFilters={setAllSourceFilters}
      />

      {!showBookmarks && (
        <div className="border-b bg-muted/30">
          <SourceTabs
            activeSource={activeSource}
            onSourceChange={handleSourceChange}
            disabledSources={disabledSources}
            onToggleSource={toggleSourceFilter}
          />
        </div>
      )}

      <main className="container mx-auto">
        {/* Errors */}
        {errors.length > 0 && (
          <div className="p-4 space-y-2">
            {errors.map((error, i) => (
              <Alert key={i} variant="destructive" className="bg-destructive/10 border-destructive/20">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Loading State — only show skeleton on first visit with no cached data */}
        {isLoading && articles.length === 0 && <LoadingSkeleton count={9} />}

        {/* Content — show when we have articles OR when initial load is done */}
        {(articles.length > 0 || !isLoading) && (
          <>
            {/* Stats Bar */}
            {!showBookmarks && (searchQuery ? displayArticles.length > 0 : filteredArticles.length > 0) && (
              <div className="px-4 py-3 flex items-center justify-between border-b bg-muted/20 gap-4">
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? (
                    <>Found <span className="font-medium text-foreground">{displayArticles.length}</span> articles for "{searchQuery}"</>
                  ) : (
                    <><span className="font-medium text-foreground">{activeSource === ALL_SOURCES_ID ? filteredArticles.length : filteredArticles.filter(a => a.source.id === activeSource).length}</span> articles</>
                  )}
                </p>
                {sourceTimings.length > 0 && (
                  <button
                    onClick={() => setShowTimingDialog(true)}
                    className="text-xs text-muted-foreground hidden sm:flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer truncate max-w-[50%]"
                  >
                    <Clock className="w-3 h-3" />
                    {slowSources.length > 0
                      ? slowSources.map(t => `${t.sourceName}: ${t.timing}ms`).join(' • ')
                      : <span className={TIMING_COLORS.FAST}>All sources fast</span>
                    }
                  </button>
                )}
              </div>
            )}

            {showBookmarks && (
              <div className="p-4 text-center border-b bg-muted/20">
                <p className="text-sm text-muted-foreground">
                  {bookmarks.length === 0
                    ? 'No saved articles yet. Bookmark articles to read them later!'
                    : <><span className="font-medium text-foreground">{bookmarks.length}</span> saved article{bookmarks.length !== 1 ? 's' : ''}</>}
                </p>
              </div>
            )}

            {articles.length === 0 && !showBookmarks && !searchQuery && !isLoading && (
              <div className="flex flex-col items-center justify-center py-20 px-4">
                <Newspaper className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground">No articles found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Try refreshing the page
                </p>
                {!searchQuery && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={handleRefresh}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                )}
              </div>
            )}

            {/* Carousel (normal browse mode) or Grid (search/bookmarks) */}
            {!searchQuery && !showBookmarks ? (
              articles.length > 0 && (
                <SourceCarousel
                  sources={filteredCarouselSources}
                  articles={filteredArticles}
                  activeSource={activeSource}
                  onSourceChange={handleSourceChange}
                  isBookmarked={isBookmarked}
                  onToggleBookmark={toggleBookmark}
                />
              )
            ) : (
              displayArticles.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                  {displayArticles.map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      isBookmarked={isBookmarked(article.id)}
                      onToggleBookmark={toggleBookmark}
                    />
                  ))}
                </div>
              )
            )}
          </>
        )}

        {/* Last Updated */}
        {lastUpdated && !isLoading && (
          <div className="text-center py-4 text-xs text-muted-foreground border-t">
            Last updated: <ClientTime isoString={lastUpdated} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t py-6 mt-8 bg-muted/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p className="font-medium text-foreground">NewsFlow</p>
          <p className="mt-1">
            Content from their respective sources. All trademarks and copyrighted material belong to their owners.
          </p>
          <p className="mt-2 text-xs">
            Articles link to original publishers. We display excerpts for discovery purposes only.
          </p>
          <div className="mt-3 flex justify-center gap-4 text-xs">
            <Link href="/terms" className="hover:underline">Terms</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:underline">Privacy</Link>
          </div>
        </div>
      </footer>

      {/* Source Timings Dialog */}
      <Dialog open={showTimingDialog} onOpenChange={setShowTimingDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Source Performance
            </DialogTitle>
            <DialogDescription>
              Time taken to fetch each news source. Cached sources show 0ms.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left">Source</TableHead>
                  <TableHead className="text-right">Time</TableHead>
                  <TableHead className="text-right">Articles</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTimings.map((t) => (
                    <TableRow key={t.sourceId}>
                      <TableCell>{t.sourceName}</TableCell>
                      <TableCell className={`text-right ${getTimingColor(t.timing)}`}>
                        {t.timing}ms
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">{t.articleCount}</TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
