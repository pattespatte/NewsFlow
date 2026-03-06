export interface NewsSource {
  id: string;
  name: string;
  url: string;
  color: string;
  bgColor: string;
}

export interface Article {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: {
    name: string;
    id: string;
    color: string;
    bgColor: string;
  };
  imageUrl?: string;
}

export interface RSSItem {
  title?: string;
  description?: string;
  link?: string;
  pubDate?: string;
  enclosure?: {
    url?: string;
    type?: string;
  };
  'media:content'?: string;
  'media:thumbnail'?: string;
  'content:encoded'?: string;
}

export interface RSSFeed {
  title?: string;
  link?: string;
  items: RSSItem[];
}

export interface RSSResponse {
  articles: Article[];
  errors: string[];
  lastUpdated: string;
}
