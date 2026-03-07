module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/api-server/src/lib/constants.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Storage keys
__turbopack_context__.s([
    "ALL_SOURCES_ID",
    ()=>ALL_SOURCES_ID,
    "API_URL",
    ()=>API_URL,
    "DESCRIPTION_MAX_LENGTH",
    ()=>DESCRIPTION_MAX_LENGTH,
    "ITEMS_PER_PAGE",
    ()=>ITEMS_PER_PAGE,
    "PLACEHOLDER_IMAGE",
    ()=>PLACEHOLDER_IMAGE,
    "RSS_CONSTANTS",
    ()=>RSS_CONSTANTS,
    "STORAGE_KEYS",
    ()=>STORAGE_KEYS,
    "TIME_THRESHOLDS",
    ()=>TIME_THRESHOLDS
]);
const STORAGE_KEYS = {
    BOOKMARKS: 'newsflow_bookmarks'
};
const API_URL = typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL : '/api';
const ALL_SOURCES_ID = 'all';
const ITEMS_PER_PAGE = 12; // 3 columns x 4 rows
const TIME_THRESHOLDS = {
    ONE_MINUTE: 60 * 1000,
    ONE_HOUR: 60 * 60 * 1000,
    ONE_DAY: 24 * 60 * 60 * 1000,
    ONE_WEEK: 7 * 24 * 60 * 60 * 1000
};
const DESCRIPTION_MAX_LENGTH = 300;
const PLACEHOLDER_IMAGE = {
    WIDTH: 400,
    HEIGHT: 250,
    ASPECT_RATIO: '16/10'
};
const RSS_CONSTANTS = {
    MIN_XML_LENGTH: 100,
    MAX_ARTICLES: 150,
    CACHE_TTL: 5 * 60 * 1000,
    FETCH_TIMEOUT: 10 * 1000
};
}),
"[project]/api-server/src/lib/sources.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ALL_NEWS_SOURCE",
    ()=>ALL_NEWS_SOURCE,
    "NEWS_SOURCES",
    ()=>NEWS_SOURCES,
    "getSourceById",
    ()=>getSourceById
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$api$2d$server$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/api-server/src/lib/constants.ts [app-route] (ecmascript)");
;
const ALL_NEWS_SOURCE = {
    id: __TURBOPACK__imported__module__$5b$project$5d2f$api$2d$server$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ALL_SOURCES_ID"],
    name: 'All News',
    url: '',
    color: '#f43f5e',
    bgColor: '#FFF1F2'
};
const NEWS_SOURCES = [
    {
        id: 'nyt-home',
        name: 'NYT Top Stories',
        url: 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml',
        color: '#A31621',
        bgColor: '#FEF2F2'
    },
    {
        id: 'nyt-world',
        name: 'NYT World',
        url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
        color: '#B91C1C',
        bgColor: '#FEF2F2'
    },
    {
        id: 'nyt-tech',
        name: 'NYT Technology',
        url: 'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml',
        color: '#059669',
        bgColor: '#ECFDF5'
    },
    {
        id: 'nyt-business',
        name: 'NYT Business',
        url: 'https://rss.nytimes.com/services/xml/rss/nyt/Business.xml',
        color: '#0284C7',
        bgColor: '#F0F9FF'
    },
    {
        id: 'bbc-world',
        name: 'BBC World',
        url: 'https://feeds.bbci.co.uk/news/world/rss.xml',
        color: '#B80000',
        bgColor: '#FEF2F2'
    },
    {
        id: 'nbc-news',
        name: 'NBC News',
        url: 'https://feeds.nbcnews.com/nbcnews/public/news',
        color: '#222222',
        bgColor: '#F5F5F5'
    },
    {
        id: 'abc-news',
        name: 'ABC News',
        url: 'https://abcnews.go.com/abcnews/topstories',
        color: '#00008B',
        bgColor: '#F0F4FF'
    },
    {
        id: 'cbs-news',
        name: 'CBS News',
        url: 'https://www.cbsnews.com/latest/rss/main',
        color: '#003087',
        bgColor: '#F0F5FF'
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
        bgColor: '#E0F7FA'
    },
    {
        id: 'npr',
        name: 'NPR News',
        url: 'https://feeds.npr.org/1001/rss.xml',
        color: '#1E3A5F',
        bgColor: '#EFF6FF'
    },
    {
        id: 'guardian-world',
        name: 'The Guardian World',
        url: 'https://www.theguardian.com/world/rss',
        color: '#052962',
        bgColor: '#EFF6FF'
    },
    {
        id: 'wired',
        name: 'Wired',
        url: 'https://www.wired.com/feed/rss',
        color: '#7C3AED',
        bgColor: '#F5F3FF'
    }
];
function getSourceById(id) {
    if (id === __TURBOPACK__imported__module__$5b$project$5d2f$api$2d$server$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ALL_SOURCES_ID"]) return ALL_NEWS_SOURCE;
    return NEWS_SOURCES.find((source)=>source.id === id);
}
}),
"[project]/api-server/src/lib/rss.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatDate",
    ()=>formatDate,
    "parseRssFeed",
    ()=>parseRssFeed
]);
function generateId(title, link) {
    const hash = (str)=>{
        let hash = 0;
        for(let i = 0; i < str.length; i++){
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(36);
    };
    return hash(title + link);
}
function stripHtml(html) {
    // First decode HTML entities (including numeric entities like &#039;)
    let text = html.replace(/&#(\d+);/g, (match, dec)=>String.fromCharCode(parseInt(dec, 10))).replace(/&#x([0-9a-fA-F]+);/g, (match, hex)=>String.fromCharCode(parseInt(hex, 16))).replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&apos;/g, "'");
    // Then remove HTML tags
    text = text.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<[^>]*>/g, '').trim();
    return text;
}
function extractImageUrl(item) {
    // Check for <image> tag (used by CBS News and others)
    if (item.image) {
        return item.image;
    }
    // Check for media:content
    if (item['media:content']) {
        return item['media:content'];
    }
    // Check for media:thumbnail
    if (item['media:thumbnail']) {
        return item['media:thumbnail'];
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
function parseRssXml(xml) {
    const items = [];
    // Extract items using regex (works for basic RSS)
    const itemMatches = xml.match(/<item[^>]*>([\s\S]*?)<\/item>/gi);
    if (itemMatches) {
        for (const itemXml of itemMatches){
            const item = {};
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
                    type: enclosureMatch[2]
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
        items
    };
}
function parseRssFeed(xml, source) {
    const feed = parseRssXml(xml);
    const articles = [];
    for (const item of feed.items){
        if (!item.title || !item.link) continue;
        const title = stripHtml(item.title);
        const description = item.description ? (()=>{
            const stripped = stripHtml(item.description);
            return stripped.length > 300 ? stripped.slice(0, 300) + '...' : stripped;
        })() : '';
        const article = {
            id: generateId(title, item.link),
            title,
            description,
            link: item.link,
            pubDate: item.pubDate || new Date().toISOString(),
            source: {
                id: source.id,
                name: source.name,
                color: source.color,
                bgColor: source.bgColor
            },
            imageUrl: extractImageUrl(item)
        };
        articles.push(article);
    }
    return articles;
}
function formatDate(dateString) {
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
                day: 'numeric'
            });
        }
    } catch  {
        return 'Unknown date';
    }
}
}),
"[project]/api-server/app/api/rss/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "OPTIONS",
    ()=>OPTIONS,
    "dynamic",
    ()=>dynamic,
    "revalidate",
    ()=>revalidate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$api$2d$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/api-server/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$api$2d$server$2f$src$2f$lib$2f$sources$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/api-server/src/lib/sources.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$api$2d$server$2f$src$2f$lib$2f$rss$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/api-server/src/lib/rss.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$api$2d$server$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/api-server/src/lib/constants.ts [app-route] (ecmascript)");
;
;
;
;
const dynamic = 'force-dynamic';
const revalidate = 0;
const feedCache = new Map();
function getCachedFeed(url) {
    const entry = feedCache.get(url);
    if (!entry) return null;
    const now = Date.now();
    if (now - entry.timestamp > __TURBOPACK__imported__module__$5b$project$5d2f$api$2d$server$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RSS_CONSTANTS"].CACHE_TTL) {
        feedCache.delete(url);
        return null;
    }
    return entry;
}
function setCachedFeed(url, data) {
    feedCache.set(url, {
        data,
        timestamp: Date.now()
    });
}
async function fetchFeed(url, sourceId) {
    // Validate source before fetching (TOCTOU fix)
    const source = __TURBOPACK__imported__module__$5b$project$5d2f$api$2d$server$2f$src$2f$lib$2f$sources$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NEWS_SOURCES"].find((s)=>s.id === sourceId);
    if (!source) {
        const errorData = {
            articles: [],
            error: 'Unknown source'
        };
        return errorData;
    }
    // Check cache first
    const cached = getCachedFeed(url);
    if (cached) {
        return cached.data;
    }
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(()=>controller.abort(), __TURBOPACK__imported__module__$5b$project$5d2f$api$2d$server$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RSS_CONSTANTS"].FETCH_TIMEOUT);
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/rss+xml, application/xml, text/xml, */*',
                'User-Agent': 'Mozilla/5.0 (compatible; NewsFlowRSS/1.0)'
            },
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (!response.ok) {
            const errorData = {
                articles: [],
                error: `HTTP ${response.status}`
            };
            setCachedFeed(url, errorData);
            return errorData;
        }
        const xml = await response.text();
        if (!xml || xml.length < __TURBOPACK__imported__module__$5b$project$5d2f$api$2d$server$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RSS_CONSTANTS"].MIN_XML_LENGTH) {
            const errorData = {
                articles: [],
                error: 'Empty response'
            };
            setCachedFeed(url, errorData);
            return errorData;
        }
        const articles = (0, __TURBOPACK__imported__module__$5b$project$5d2f$api$2d$server$2f$src$2f$lib$2f$rss$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseRssFeed"])(xml, source);
        const result = {
            articles
        };
        // Cache the result
        setCachedFeed(url, result);
        return result;
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        const errorData = {
            articles: [],
            error: message
        };
        setCachedFeed(url, errorData);
        return errorData;
    }
}
async function GET(request) {
    const { searchParams } = new URL(request.url);
    const sourceId = searchParams.get('source');
    const response = {
        articles: [],
        errors: [],
        lastUpdated: new Date().toISOString()
    };
    // Determine which sources to fetch
    const sourcesToFetch = sourceId && sourceId !== 'all' ? __TURBOPACK__imported__module__$5b$project$5d2f$api$2d$server$2f$src$2f$lib$2f$sources$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NEWS_SOURCES"].filter((s)=>s.id === sourceId) : __TURBOPACK__imported__module__$5b$project$5d2f$api$2d$server$2f$src$2f$lib$2f$sources$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NEWS_SOURCES"];
    if (sourcesToFetch.length === 0) {
        response.errors.push(`Source "${sourceId}" not found`);
        return __TURBOPACK__imported__module__$5b$project$5d2f$api$2d$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(response);
    }
    // Fetch all feeds in parallel
    const fetchPromises = sourcesToFetch.map(async (source)=>{
        const result = await fetchFeed(source.url, source.id);
        if (result.error) {
            response.errors.push(`${source.name}: ${result.error}`);
        }
        return result.articles;
    });
    try {
        const results = await Promise.all(fetchPromises);
        // Combine all articles and deduplicate by URL
        const seenUrls = new Map();
        for (const articles of results){
            for (const article of articles){
                // Use the article URL as the unique key
                if (!seenUrls.has(article.link)) {
                    seenUrls.set(article.link, article);
                }
            }
        }
        // Convert back to array and sort by date (newest first)
        response.articles = Array.from(seenUrls.values());
        response.articles.sort((a, b)=>b.pubDate.localeCompare(a.pubDate));
        // Limit to max articles
        response.articles = response.articles.slice(0, __TURBOPACK__imported__module__$5b$project$5d2f$api$2d$server$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RSS_CONSTANTS"].MAX_ARTICLES);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch feeds';
        response.errors.push(message);
    }
    // Set cache and CORS headers
    return __TURBOPACK__imported__module__$5b$project$5d2f$api$2d$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(response, {
        headers: {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=150',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    });
}
async function OPTIONS() {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$api$2d$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"](null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__e9591172._.js.map