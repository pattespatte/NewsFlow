'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Header } from '@/components/Header';
import { SourceTabs } from '@/components/SourceTabs';
import { ArticleCard } from '@/components/ArticleCard';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Newspaper, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { matchesSearch } from '@/lib/utils';
import { STORAGE_KEYS, ALL_SOURCES_ID, ITEMS_PER_PAGE } from '@/lib/constants';
import type { Article, RSSResponse } from '@/types/article';

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [bookmarks, setBookmarks] = useState<Article[]>([]);
  const [activeSource, setActiveSource] = useState(ALL_SOURCES_ID);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);

  // Use a Set for O(1) bookmark lookups instead of Array.some() O(n)
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

  // Fetch articles from API
  const fetchArticles = useCallback(async (sourceId?: string) => {
    setIsLoading(true);
    setErrors([]);
    setDisplayCount(ITEMS_PER_PAGE);

    try {
      const source = sourceId || activeSource;
      const url = `/api/rss?source=${source === ALL_SOURCES_ID ? ALL_SOURCES_ID : source}`;

      const response = await fetch(url);
      const data: RSSResponse = await response.json();

      setArticles(data.articles);
      setErrors(data.errors);
      setLastUpdated(data.lastUpdated);
    } catch (error) {
      setErrors(['Failed to fetch news. Please try again.']);
    } finally {
      setIsLoading(false);
    }
  }, [activeSource]);

  // Initial fetch
  useEffect(() => {
    fetchArticles();
  }, []);

  // Fetch when source changes
  useEffect(() => {
    if (!showBookmarks) {
      fetchArticles();
    }
  }, [activeSource, showBookmarks, fetchArticles]);

  // Handle source change
  const handleSourceChange = useCallback((sourceId: string) => {
    setActiveSource(sourceId);
    setShowBookmarks(false);
    setSearchQuery('');
  }, []);

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
      fetchArticles();
    }
  }, [showBookmarks, fetchArticles]);

  // Handle search change
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Toggle search on mobile
  const handleToggleSearch = useCallback(() => {
    setShowSearch((prev) => !prev);
  }, []);

  // Get display articles
  const displayArticles = useMemo(() => {
    const base = showBookmarks ? bookmarks : articles;

    // Filter by active source when not in bookmarks mode
    const sourceFiltered = !showBookmarks && activeSource !== ALL_SOURCES_ID
      ? base.filter((a) => a.source.id === activeSource)
      : base;

    // Filter by search query - pre-compute lowercase query once
    const searchFiltered = searchQuery.trim()
      ? (() => {
          const query = searchQuery.toLowerCase();
          return sourceFiltered.filter((a) =>
            matchesSearch(a.title, query) ||
            matchesSearch(a.description, query) ||
            matchesSearch(a.source.name, query)
          );
        })()
      : sourceFiltered;

    return searchFiltered;
  }, [showBookmarks, bookmarks, articles, activeSource, searchQuery]);

  // Paginated articles
  const paginatedArticles = useMemo(() => {
    return displayArticles.slice(0, displayCount);
  }, [displayArticles, displayCount]);

  // Has more articles to load
  const hasMore = displayCount < displayArticles.length;

  // Load more articles
  const handleLoadMore = useCallback(() => {
    setDisplayCount((prev) => prev + ITEMS_PER_PAGE);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header
        showBookmarks={showBookmarks}
        onToggleBookmarks={handleToggleBookmarks}
        onRefresh={handleRefresh}
        isLoading={isLoading}
        bookmarkCount={bookmarks.length}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onToggleSearch={handleToggleSearch}
        showSearch={showSearch}
      />

      {!showBookmarks && (
        <div className="border-b bg-muted/30">
          <SourceTabs
            activeSource={activeSource}
            onSourceChange={handleSourceChange}
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

        {/* Loading State */}
        {isLoading && <LoadingSkeleton count={9} />}

        {/* Content */}
        {!isLoading && (
          <>
            {/* Stats Bar */}
            {!showBookmarks && displayArticles.length > 0 && (
              <div className="px-4 py-3 flex items-center justify-between border-b bg-muted/20">
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? (
                    <>Found <span className="font-medium text-foreground">{displayArticles.length}</span> articles for "{searchQuery}"</>
                  ) : (
                    <><span className="font-medium text-foreground">{displayArticles.length}</span> articles</>
                  )}
                </p>
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

            {displayArticles.length === 0 && !showBookmarks && !isLoading && (
              <div className="flex flex-col items-center justify-center py-20 px-4">
                <Newspaper className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground">No articles found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {searchQuery 
                    ? 'Try a different search term'
                    : 'Try selecting a different source or refresh the page'}
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

            {paginatedArticles.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {paginatedArticles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    isBookmarked={isBookmarked(article.id)}
                    onToggleBookmark={toggleBookmark}
                  />
                ))}
              </div>
            )}

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center py-6">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleLoadMore}
                  className="min-w-[200px]"
                >
                  Load More ({displayArticles.length - displayCount} remaining)
                </Button>
              </div>
            )}
          </>
        )}

        {/* Last Updated */}
        {lastUpdated && !isLoading && (
          <div className="text-center py-4 text-xs text-muted-foreground border-t">
            Last updated: {new Date(lastUpdated).toLocaleTimeString()}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t py-6 mt-8 bg-muted/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p className="font-medium text-foreground">NewsFlow</p>
          <p className="mt-1">
            Powered by RSS feeds from NYT, BBC, Reuters, NPR, Guardian, and Wired
          </p>
        </div>
      </footer>
    </div>
  );
}
