'use client';

import { useState, useRef, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { NEWS_SOURCES } from '@/lib/sources';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SourceFilterProps {
  disabledSources: Set<string>;
  onToggleSource: (sourceId: string) => void;
  onSetAll: (disabled: boolean) => void;
}

export function SourceFilter({ disabledSources, onToggleSource, onSetAll }: SourceFilterProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const disabledCount = disabledSources.size;
  const allDisabled = disabledCount === NEWS_SOURCES.length;

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="ghost"
        size="icon"
        className="relative h-9 w-9 transition-colors duration-200 ease-out cursor-pointer"
        onClick={() => setOpen(prev => !prev)}
      >
        <Filter className={`h-4 w-4 transition-colors duration-200 ease-out ${disabledCount > 0 ? 'text-primary' : 'text-muted-foreground'}`} />
        {disabledCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] bg-primary text-primary-foreground rounded-full flex items-center justify-center font-medium">
            {disabledCount}
          </span>
        )}
      </Button>
      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 w-80 rounded-md border bg-popover p-3 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">
              {disabledCount === 0 ? 'All sources visible' : `${NEWS_SOURCES.length - disabledCount} of ${NEWS_SOURCES.length} visible`}
            </span>
            <button
              onClick={() => onSetAll(!allDisabled)}
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
                      className={cn(
                        'inline-flex items-center justify-center w-4 h-4 rounded-[3px] border transition-colors flex-shrink-0',
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
  );
}
