import type { Article, RSSFeed, RSSItem, NewsSource } from '@/types/article';

function generateId(title: string, link: string): string {
  const hash = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  };
  return hash(title + link);
}

function stripHtml(html: string): string {
  // First decode HTML entities (including numeric entities like &#039;)
  let text = html
    .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(parseInt(dec, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");

  // Then remove HTML tags
  text = text
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();

  return text;
}

// UTM tracking parameters to remove from URLs
const TRACKING_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;

function stripTrackingParams(url: string): string {
  try {
    const urlObj = new URL(url);
    for (const param of TRACKING_PARAMS) {
      urlObj.searchParams.delete(param);
    }
    return urlObj.href;
  } catch {
    return url;
  }
}

function extractImageUrl(item: RSSItem): string | undefined {
  // Check for <image> tag (used by CBS News and others)
  if (item.image) {
    return item.image;
  }

  // Check for media:thumbnail (images only, media:content can be video)
  if (item['media:thumbnail']) {
    return item['media:thumbnail'];
  }

  // Check for media:content (only if not already found in thumbnail)
  if (item['media:content']) {
    return item['media:content'];
  }

  // Check for enclosure with image type
  if (item.enclosure?.url && item.enclosure.type?.startsWith('image/')) {
    return item.enclosure.url;
  }

  // Try to extract image from content:encoded first (full HTML content)
  if (item['content:encoded']) {
    // Match img src with various quote styles and handle URLs with spaces
    const contentImgMatch = item['content:encoded'].match(/<img[^>]+\bsrc\s*=\s*["']([^"']+)["']/i);
    if (contentImgMatch) {
      return contentImgMatch[1].replace(/&amp;/g, '&');
    }
    // Try for src without quotes (some feeds use this)
    const contentImgMatch2 = item['content:encoded'].match(/<img[^>]+\bsrc\s*=\s*([^\s"'>]+)/i);
    if (contentImgMatch2) {
      return contentImgMatch2[1].replace(/&amp;/g, '&');
    }
  }

  // Fallback: try to extract image from description
  if (item.description) {
    const descImgMatch = item.description.match(/<img[^>]+\bsrc\s*=\s*["']([^"']+)["']/i);
    if (descImgMatch) {
      return descImgMatch[1].replace(/&amp;/g, '&');
    }
    const descImgMatch2 = item.description.match(/<img[^>]+\bsrc\s*=\s*([^\s"'>]+)/i);
    if (descImgMatch2) {
      return descImgMatch2[1].replace(/&amp;/g, '&');
    }
  }

  return undefined;
}

function parseRssXml(xml: string): RSSFeed {
  const items: RSSItem[] = [];

  // Extract items using regex (works for basic RSS)
  const itemMatches = xml.match(/<item[^>]*>([\s\S]*?)<\/item>/gi);

  if (itemMatches) {
    for (const itemXml of itemMatches) {
      const item: RSSItem = {};

      // Extract title
      const titleMatch = itemXml.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>|<title>([\s\S]*?)<\/title>/i);
      if (titleMatch) {
        item.title = (titleMatch[1] || titleMatch[2] || '').trim();
      }

      // Extract description
      const descMatch = itemXml.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>|<description>([\s\S]*?)<\/description>/i);
      if (descMatch) {
        item.description = (descMatch[1] || descMatch[2] || '').trim();
      }

      // Extract content:encoded (often contains full HTML with images)
      const contentMatch = itemXml.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>|<content:encoded>([\s\S]*?)<\/content:encoded>/i);
      if (contentMatch) {
        item['content:encoded'] = (contentMatch[1] || contentMatch[2] || '').trim();
      }

      // Extract link - handle both plain links and CDATA-wrapped links
      const linkMatch = itemXml.match(/<link><!\[CDATA\[([\s\S]*?)\]\]><\/link>|<link>([\s\S]*?)<\/link>/i);
      if (linkMatch) {
        item.link = (linkMatch[1] || linkMatch[2] || '').trim();
      }

      // Extract pubDate
      const dateMatch = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/i);
      if (dateMatch) {
        item.pubDate = dateMatch[1].trim();
      }

      // Extract enclosure
      const enclosureMatch = itemXml.match(/<enclosure[^>]+url=["']([^"']+)["'][^>]*type=["']([^"']+)["']/i);
      if (enclosureMatch) {
        item.enclosure = {
          url: enclosureMatch[1],
          type: enclosureMatch[2],
        };
      }

      // Extract media:content
      const mediaMatch = itemXml.match(/<media:content[^>]+url=["']([^"']+)["']/i);
      if (mediaMatch) {
        item['media:content'] = mediaMatch[1];
      }

      // Extract media:thumbnail
      const thumbnailMatch = itemXml.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/i);
      if (thumbnailMatch) {
        item['media:thumbnail'] = thumbnailMatch[1];
      }

      // Extract plain <image> tag (used by CBS News and others)
      const imageMatch = itemXml.match(/<image><!\[CDATA\[([\s\S]*?)\]\]><\/image>|<image>([\s\S]*?)<\/image>/i);
      if (imageMatch) {
        item.image = (imageMatch[1] || imageMatch[2] || '').trim();
      }

      items.push(item);
    }
  }

  return {
    items,
  };
}

export function parseRssFeed(xml: string, source: NewsSource): Article[] {
  const feed = parseRssXml(xml);
  const articles: Article[] = [];

  for (const item of feed.items) {
    if (!item.title || !item.link) continue;

    const title = stripHtml(item.title);
    const description = item.description
      ? (() => {
          const stripped = stripHtml(item.description);
          return stripped.length > 300 ? stripped.slice(0, 300) + '...' : stripped;
        })()
      : '';

    const article: Article = {
      id: generateId(title, item.link),
      title,
      description,
      link: stripTrackingParams(item.link),
      pubDate: item.pubDate || new Date().toISOString(),
      source: {
        id: source.id,
        name: source.name,
        color: source.color,
        bgColor: source.bgColor,
      },
      imageUrl: extractImageUrl(item),
    };

    articles.push(article);
  }

  return articles;
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  } catch {
    return 'Unknown date';
  }
}
