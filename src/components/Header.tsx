'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Newspaper, Bookmark, RefreshCw, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Input } from '@/components/ui/input';
import { NEWS_SOURCES } from '@/lib/sources';
import { cn } from '@/lib/utils';

interface HeaderProps {
  showBookmarks: boolean;
  onToggleBookmarks: () => void;
  onRefresh: () => void;
  isLoading: boolean;
  bookmarkCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onToggleSearch: () => void;
  showSearch: boolean;
  disabledSources: Set<string>;
  onToggleSource: (sourceId: string) => void;
  onSetAllSourceFilters: (disabled: boolean) => void;
}

export function Header({
  showBookmarks,
  onToggleBookmarks,
  onRefresh,
  isLoading,
  bookmarkCount,
  searchQuery,
  onSearchChange,
  onToggleSearch,
  showSearch,
  disabledSources,
  onToggleSource,
  onSetAllSourceFilters,
}: HeaderProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const disabledCount = disabledSources.size;
  const allDisabled = disabledCount === NEWS_SOURCES.length;

  useEffect(() => {
    if (!filterOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [filterOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" suppressHydrationWarning>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="./"
            className="flex items-center gap-3 flex-shrink-0"
            onClick={(e) => {
              if (showBookmarks) {
                e.preventDefault();
                onToggleBookmarks();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 shadow-lg shadow-rose-500/20 transition-transform duration-200 ease-out hover:scale-105">
              <Newspaper className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-rose-600 to-orange-500 bg-clip-text text-transparent">NewsFlow</h1>
              <p className="text-xs text-muted-foreground">Your daily news companion</p>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors duration-200 ease-out" />
              <Input
                type="search"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 w-full bg-muted/50 border-transparent focus:border-primary/50 transition-colors duration-200 ease-out"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Mobile Search Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9 transition-colors duration-200 ease-out cursor-pointer"
              onClick={onToggleSearch}
            >
              <Search className={`w-4 w-4 transition-colors duration-200 ease-out ${showSearch ? 'text-primary' : ''}`} />
            </Button>

            {/* Filter */}
            <div className="relative" ref={filterRef}>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9 transition-colors duration-200 ease-out cursor-pointer"
                onClick={() => setFilterOpen(prev => !prev)}
              >
                <Filter className={`h-4 w-4 transition-colors duration-200 ease-out ${disabledCount > 0 ? 'text-primary' : 'text-muted-foreground'}`} />
                {disabledCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] bg-primary text-primary-foreground rounded-full flex items-center justify-center font-medium">
                    {disabledCount}
                  </span>
                )}
              </Button>
              {filterOpen && (
                <div className="absolute right-0 top-full mt-2 z-50 w-80 rounded-md border bg-popover p-3 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      {disabledCount === 0 ? 'All sources visible' : `${NEWS_SOURCES.length - disabledCount} of ${NEWS_SOURCES.length} visible`}
                    </span>
                    <button
                      onClick={() => onSetAllSourceFilters(!allDisabled)}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      {allDisabled ? 'Show all' : 'Hide all'}
                    </button>
                  </div>
                  <div className="max-h-[50vh] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-1">
                      {NEWS_SOURCES.map((source) => {
                        const isChecked = !disabledSources.has(source.id);
                        return (
                          <label
                            key={source.id}
                            className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
                          >
                            <span
                              onClick={(e) => {
                                e.preventDefault();
                                onToggleSource(source.id);
                              }}
                              className={cn(
                                'inline-flex items-center justify-center w-4 h-4 rounded-[3px] border transition-colors flex-shrink-0 cursor-pointer',
                                isChecked
                                  ? 'border-primary bg-primary text-primary-foreground'
                                  : 'border-muted-foreground/30 bg-transparent'
                              )}
                            >
                              {isChecked && (
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                              )}
                            </span>
                            <span className="text-xs truncate">{source.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Refresh Button - responsive */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="hidden sm:flex transition-all duration-200 ease-out hover:scale-105 cursor-pointer"
            >
              <RefreshCw className={`w-4 w-4 mr-2 transition-transform duration-500 ease-out ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={onRefresh}
              disabled={isLoading}
              className="sm:hidden h-9 w-9 transition-colors duration-200 ease-out cursor-pointer"
            >
              <RefreshCw className={`w-4 w-4 transition-transform duration-500 ease-out ${isLoading ? 'animate-spin' : ''}`} />
            </Button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Bookmarks Button */}
            <Button
              variant={showBookmarks ? 'default' : 'ghost'}
              size="sm"
              onClick={onToggleBookmarks}
              className="relative transition-all duration-200 ease-out hover:scale-105 cursor-pointer"
            >
              <Bookmark className={`w-4 w-4 sm:mr-2 transition-all duration-200 ease-out ${showBookmarks ? 'fill-current scale-110' : ''}`} />
              <span className="hidden sm:inline">
                {showBookmarks ? 'All News' : 'Saved'}
              </span>
              {bookmarkCount > 0 && !showBookmarks && (
                <span className="absolute -top-1 -right-1 w-5 h-5 text-xs bg-rose-500 text-white rounded-full flex items-center justify-center font-medium transition-transform duration-200 ease-out animate-in zoom-in">
                  {bookmarkCount > 9 ? '9+' : bookmarkCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showSearch && (
          <div className="md:hidden pb-3 animate-in slide-in-from-top-2 duration-200 ease-out">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 w-full bg-muted/50 border-transparent focus:border-primary/50"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
