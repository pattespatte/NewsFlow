// Storage keys
export const STORAGE_KEYS = {
  BOOKMARKS: 'newsflow_bookmarks',
  ARTICLES_CACHE: 'newsflow_articles_cache',
  DISABLED_SOURCES: 'newsflow_disabled_sources',
} as const;

// API Configuration
// Use NEXT_PUBLIC_API_URL environment variable to override the API endpoint
// Examples:
//   - Local API: (not set, defaults to '/api')
//   - Vercel API: 'https://your-app.vercel.app/api'
//   - Custom API: 'https://api.example.com'
export const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Source IDs
export const ALL_SOURCES_ID = 'all';

// Pagination
export const ITEMS_PER_PAGE = 12; // 3 columns x 4 rows

// RSS parsing
export const RSS_CONSTANTS = {
  MIN_XML_LENGTH: 100,
  MAX_ARTICLES: 1000,
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes
  FETCH_TIMEOUT: 10 * 1000, // 10 seconds
} as const;

// Timing performance thresholds (in milliseconds)
export const TIMING_THRESHOLDS = {
  FAST: 500,    // Green - cached or very fast
  MEDIUM: 1000, // Yellow - acceptable but slow
  SLOW: Infinity, // Red - too slow, indicates problem
} as const;

// Timing color classes for display
export const TIMING_COLORS = {
  FAST: 'text-green-600 dark:text-green-400',
  MEDIUM: 'text-yellow-600 dark:text-yellow-400',
  SLOW: 'text-red-500 font-medium',
} as const;

export function getTimingColor(timing: number): string {
  if (timing > TIMING_THRESHOLDS.MEDIUM) return TIMING_COLORS.SLOW;
  if (timing > TIMING_THRESHOLDS.FAST) return TIMING_COLORS.MEDIUM;
  return TIMING_COLORS.FAST;
}
