'use client';

import { Newspaper, Bookmark, RefreshCw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Input } from '@/components/ui/input';

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
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 shadow-lg shadow-rose-500/20">
              <Newspaper className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-rose-600 to-orange-500 bg-clip-text text-transparent">NewsFlow</h1>
              <p className="text-xs text-muted-foreground">Your daily news companion</p>
            </div>
          </div>
          
          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 w-full bg-muted/50 border-transparent focus:border-primary/50"
              />
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Mobile Search Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9"
              onClick={onToggleSearch}
            >
              <Search className={`w-4 h-4 ${showSearch ? 'text-primary' : ''}`} />
            </Button>
            
            {/* Refresh Button - responsive */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="hidden sm:flex"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={onRefresh}
              disabled={isLoading}
              className="sm:hidden h-9 w-9"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Bookmarks Button */}
            <Button
              variant={showBookmarks ? 'default' : 'ghost'}
              size="sm"
              onClick={onToggleBookmarks}
              className="relative"
            >
              <Bookmark className={`w-4 h-4 sm:mr-2 ${showBookmarks ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">
                {showBookmarks ? 'All News' : 'Saved'}
              </span>
              {bookmarkCount > 0 && !showBookmarks && (
                <span className="absolute -top-1 -right-1 w-5 h-5 text-xs bg-rose-500 text-white rounded-full flex items-center justify-center font-medium">
                  {bookmarkCount > 9 ? '9+' : bookmarkCount}
                </span>
              )}
            </Button>
          </div>
        </div>
        
        {/* Mobile Search Bar */}
        {showSearch && (
          <div className="md:hidden pb-3">
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
