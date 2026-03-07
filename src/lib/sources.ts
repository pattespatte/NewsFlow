import type { NewsSource } from '@/types/article';
import { ALL_SOURCES_ID } from './constants';

// Re-export for convenience
export { ALL_SOURCES_ID };

export const ALL_NEWS_SOURCE: NewsSource = {
  id: ALL_SOURCES_ID,
  name: 'All News',
  url: '', // not used
  color: '#f43f5e',
  bgColor: '#FFF1F2',
};

export const NEWS_SOURCES: NewsSource[] = [
  {
    id: 'nyt-home',
    name: 'NYT Top Stories',
    url: 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml',
    color: '#A31621',
    bgColor: '#FEF2F2',
  },
  {
    id: 'nyt-world',
    name: 'NYT World',
    url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
    color: '#B91C1C',
    bgColor: '#FEF2F2',
  },
  {
    id: 'nyt-tech',
    name: 'NYT Technology',
    url: 'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml',
    color: '#059669',
    bgColor: '#ECFDF5',
  },
  {
    id: 'nyt-business',
    name: 'NYT Business',
    url: 'https://rss.nytimes.com/services/xml/rss/nyt/Business.xml',
    color: '#0284C7',
    bgColor: '#F0F9FF',
  },
  {
    id: 'bbc-world',
    name: 'BBC World',
    url: 'https://feeds.bbci.co.uk/news/world/rss.xml',
    color: '#B80000',
    bgColor: '#FEF2F2',
  },
  {
    id: 'nbc-news',
    name: 'NBC News',
    url: 'https://feeds.nbcnews.com/nbcnews/public/news',
    color: '#222222',
    bgColor: '#F5F5F5',
  },
  {
    id: 'abc-news',
    name: 'ABC News',
    url: 'https://abcnews.go.com/abcnews/topstories',
    color: '#00008B',
    bgColor: '#F0F4FF',
  },
  {
    id: 'cbs-news',
    name: 'CBS News',
    url: 'https://www.cbsnews.com/latest/rss/main',
    color: '#003087',
    bgColor: '#F0F5FF',
  },
  // CNN removed due to SSL certificate issues with their RSS feed
  // {
  //   id: 'cnn',
  //   name: 'CNN',
  //   url: 'https://rss.cnn.com/rss/cnn_topstories.rss',
  //   color: '#CC0000',
  //   bgColor: '#FEF2F2',
  // },
  {
    id: 'aljazeera',
    name: 'Al Jazeera',
    url: 'https://www.aljazeera.com/xml/rss/all.xml',
    color: '#007A87',
    bgColor: '#E0F7FA',
  },
  {
    id: 'npr',
    name: 'NPR News',
    url: 'https://feeds.npr.org/1001/rss.xml',
    color: '#1E3A5F',
    bgColor: '#EFF6FF',
  },
  {
    id: 'guardian-world',
    name: 'The Guardian World',
    url: 'https://www.theguardian.com/world/rss',
    color: '#052962',
    bgColor: '#EFF6FF',
  },
  {
    id: 'wired',
    name: 'Wired',
    url: 'https://www.wired.com/feed/rss',
    color: '#7C3AED',
    bgColor: '#F5F3FF',
  },
  {
    id: 'the-hill',
    name: 'The Hill',
    url: 'https://feeds.feedburner.com/thehill',
    color: '#222222',
    bgColor: '#F5F5F5',
  },
  {
    id: 'pew-research',
    name: 'Pew Research',
    url: 'https://www.pewresearch.org/feed/',
    color: '#1E3A5F',
    bgColor: '#EFF6FF',
  },
  {
    id: 'politico',
    name: 'POLITICO',
    url: 'https://rss.politico.com/politics-news.xml',
    color: '#A31621',
    bgColor: '#FEF2F2',
  },
  {
    id: 'npr-politics',
    name: 'NPR Politics',
    url: 'https://feeds.npr.org/1014/rss.xml',
    color: '#1E3A5F',
    bgColor: '#EFF6FF',
  },
  {
    id: 'time',
    name: 'Time',
    url: 'https://time.com/feed/',
    color: '#B91C1C',
    bgColor: '#FEF2F2',
  },
];

export function getSourceById(id: string): NewsSource | undefined {
  if (id === ALL_SOURCES_ID) return ALL_NEWS_SOURCE;
  return NEWS_SOURCES.find(source => source.id === id);
}
