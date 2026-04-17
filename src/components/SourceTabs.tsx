'use client';

import { NEWS_SOURCES, ALL_NEWS_SOURCE } from '@/lib/sources';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Check } from 'lucide-react';

interface SourceTabsProps {
  activeSource: string;
  onSourceChange: (sourceId: string) => void;
  disabledSources: Set<string>;
  onToggleSource: (sourceId: string) => void;
}

export function SourceTabs({ activeSource, onSourceChange, disabledSources, onToggleSource }: SourceTabsProps) {
  const allSources = [ALL_NEWS_SOURCE, ...NEWS_SOURCES];

  return (
    <ScrollArea className="w-full">
      <div className="flex gap-2 px-4 py-3">
        {allSources.map((source) => {
          const isActive = activeSource === source.id;
          const isDisabled = source.id !== 'all' && disabledSources.has(source.id);
          const isAll = source.id === 'all';
          return (
            <button
              key={source.id}
              data-source-id={source.id}
              onClick={() => onSourceChange(source.id)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ease-out whitespace-nowrap cursor-pointer',
                'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary/50',
                'hover:scale-[1.03] active:scale-[0.97]',
                'flex items-center gap-1.5',
                isDisabled && 'opacity-40',
                isActive && !isDisabled
                  ? 'bg-foreground text-background shadow-lg hover:bg-foreground/90'
                  : 'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground border border-transparent hover:border-border/50'
              )}
            >
              {!isAll && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSource(source.id);
                  }}
                  className={cn(
                    'inline-flex items-center justify-center w-3.5 h-3.5 rounded-[3px] border transition-colors flex-shrink-0 cursor-pointer',
                    isDisabled
                      ? 'border-muted-foreground/30 bg-transparent'
                      : 'border-primary bg-primary text-primary-foreground'
                  )}
                >
                  {!isDisabled && <Check className="w-2.5 h-2.5" strokeWidth={3} />}
                </span>
              )}
              {source.name}
            </button>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" className="h-2" />
    </ScrollArea>
  );
}
