'use client';

import { useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ArticleCard } from '@/components/ArticleCard';
import type { Article, NewsSource } from '@/types/article';

interface SourceCarouselProps {
  sources: NewsSource[];
  articles: Article[];
  activeSource: string;
  onSourceChange: (sourceId: string) => void;
  isBookmarked: (articleId: string) => boolean;
  onToggleBookmark: (article: Article) => void;
}

export function SourceCarousel({
  sources,
  articles,
  activeSource,
  onSourceChange,
  isBookmarked,
  onToggleBookmark,
}: SourceCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isSwiping = useRef(false);

  const activeIndex = sources.findIndex(s => s.id === activeSource);

  // Scroll to the active source when it changes from outside (tab click)
  useEffect(() => {
    if (isSwiping.current) {
      isSwiping.current = false;
      return;
    }
    const container = scrollRef.current;
    if (!container || activeIndex < 0) return;
    container.scrollTo({
      left: activeIndex * container.clientWidth,
      behavior: 'smooth',
    });
  }, [activeIndex]);

  // Detect which slide is visible after user scrolls/swipes
  const handleScrollEnd = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;
    const index = Math.round(container.scrollLeft / container.clientWidth);
    if (index >= 0 && index < sources.length && sources[index].id !== activeSource) {
      isSwiping.current = true;
      onSourceChange(sources[index].id);
    }
  }, [sources, activeSource, onSourceChange]);

  // Use scrollend event where available, fallback to debounced scroll
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let timeout: ReturnType<typeof setTimeout>;

    const onScrollEnd = () => {
      handleScrollEnd();
    };

    const onScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(handleScrollEnd, 150);
    };

    container.addEventListener('scrollend', onScrollEnd);
    container.addEventListener('scroll', onScroll);

    return () => {
      container.removeEventListener('scrollend', onScrollEnd);
      container.removeEventListener('scroll', onScroll);
      clearTimeout(timeout);
    };
  }, [handleScrollEnd]);

  const navigate = useCallback(
    (direction: -1 | 1) => {
      const nextIndex = Math.max(0, Math.min(sources.length - 1, activeIndex + direction));
      if (nextIndex !== activeIndex) {
        onSourceChange(sources[nextIndex].id);
      }
    },
    [activeIndex, sources, onSourceChange],
  );

  return (
    <div className="relative group">
      {/* Left arrow — desktop only */}
      {activeIndex > 0 && (
        <button
          onClick={() => navigate(-1)}
          className="hidden md:flex absolute left-0 top-0 bottom-0 z-10 w-14 items-center justify-center
                     bg-gradient-to-r from-background/80 to-transparent
                     opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
          aria-label="Previous source"
        >
          <ChevronLeft className="w-8 h-8 text-muted-foreground" />
        </button>
      )}

      {/* Right arrow — desktop only */}
      {activeIndex < sources.length - 1 && (
        <button
          onClick={() => navigate(1)}
          className="hidden md:flex absolute right-0 top-0 bottom-0 z-10 w-14 items-center justify-center
                     bg-gradient-to-l from-background/80 to-transparent
                     opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
          aria-label="Next source"
        >
          <ChevronRight className="w-8 h-8 text-muted-foreground" />
        </button>
      )}

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex">
          {sources.map((source) => {
            const sourceArticles = source.id === 'all'
              ? articles
              : articles.filter(a => a.source.id === source.id);

            return (
              <div
                key={source.id}
                className="min-w-full snap-start"
              >
                {sourceArticles.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                    {sourceArticles.map((article) => (
                      <ArticleCard
                        key={article.id}
                        article={article}
                        isBookmarked={isBookmarked(article.id)}
                        onToggleBookmark={onToggleBookmark}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 px-4">
                    <p className="text-sm text-muted-foreground">No articles from {source.name}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
