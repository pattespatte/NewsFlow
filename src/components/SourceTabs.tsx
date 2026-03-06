'use client';

import { NEWS_SOURCES, ALL_NEWS_SOURCE } from '@/lib/sources';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface SourceTabsProps {
  activeSource: string;
  onSourceChange: (sourceId: string) => void;
}

export function SourceTabs({ activeSource, onSourceChange }: SourceTabsProps) {
  const allSources = [ALL_NEWS_SOURCE, ...NEWS_SOURCES];

  return (
    <ScrollArea className="w-full">
      <div className="flex gap-2 px-4 py-3">
        {allSources.map((source) => {
          const isActive = activeSource === source.id;
          return (
            <button
              key={source.id}
              onClick={() => onSourceChange(source.id)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap',
                'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background',
                'hover:scale-105 active:scale-95',
                isActive
                  ? 'text-white shadow-lg'
                  : 'bg-muted/50 hover:bg-muted text-foreground border border-transparent hover:border-border'
              )}
              style={isActive ? { 
                backgroundColor: source.color,
                boxShadow: `0 4px 14px ${source.color}40`,
              } : {}}
            >
              {source.name}
            </button>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" className="h-2" />
    </ScrollArea>
  );
}
