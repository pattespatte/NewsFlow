'use client';

import { Bookmark, ExternalLink, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/rss';
import type { Article } from '@/types/article';
import { cn } from '@/lib/utils';

interface ArticleCardProps {
  article: Article;
  isBookmarked: boolean;
  onToggleBookmark: (article: Article) => void;
}

export function ArticleCard({ article, isBookmarked, onToggleBookmark }: ArticleCardProps) {
  const placeholderImage = `https://picsum.photos/seed/${article.id}/400/250`;

  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
    >
      <Card className="article-card h-full hover:shadow-xl border-border/50 hover:border-border bg-card flex flex-col cursor-pointer">
        <div className="relative flex-shrink-0">
          {/* Image Container */}
          <div className="relative aspect-[16/10] overflow-hidden bg-muted">
            <img
              src={article.imageUrl || placeholderImage}
              alt={article.title}
              className="article-card-image w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = placeholderImage;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out" />
          </div>

          {/* Source Badge */}
          <div className="absolute top-3 left-3">
            <Badge
              className="text-xs font-semibold border-0 shadow-lg backdrop-blur-sm px-3 py-1"
              style={{
                backgroundColor: article.source.bgColor,
                color: article.source.color,
              }}
            >
              {article.source.name}
            </Badge>
          </div>

          {/* Bookmark indicator */}
          {isBookmarked && (
            <div className="absolute top-3 right-3">
              <div className="w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center shadow-lg">
                <Bookmark className="w-3 h-3 text-white fill-current" />
              </div>
            </div>
          )}
        </div>

        <CardContent className="p-4 flex flex-col flex-grow">
          {/* Title */}
          <h3 className="font-bold text-base leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200 ease-out flex-grow">
            {article.title}
          </h3>

          {/* Description */}
          {article.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
              {article.description}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-border/50 mt-auto">
            <div className="flex items-center text-xs text-muted-foreground font-medium">
              <Clock className="w-3.5 h-3.5 mr-1.5" />
              {formatDate(article.pubDate)}
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-rose-100 dark:hover:bg-rose-950/30 transition-colors duration-200 ease-out"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleBookmark(article);
                }}
              >
                <Bookmark
                  className={cn(
                    'w-4 h-4 transition-all duration-200 ease-out',
                    isBookmarked ? 'fill-rose-500 text-rose-500 scale-110' : 'hover:text-rose-500'
                  )}
                />
              </Button>

              <div className="h-8 w-8 flex items-center justify-center hover:bg-primary/10 rounded-md transition-colors duration-200 ease-out">
                <ExternalLink className="w-4 h-4 text-muted-foreground transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </a>
  );
}
