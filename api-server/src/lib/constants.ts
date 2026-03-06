// Storage keys
export const STORAGE_KEYS = {
  BOOKMARKS: 'newsflow_bookmarks',
} as const;

// API Configuration
// For local development, use relative path. For production, set NEXT_PUBLIC_API_URL env var.
export const API_URL = typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL
  : '/api';

// Source IDs
export const ALL_SOURCES_ID = 'all';

// Pagination
export const ITEMS_PER_PAGE = 12; // 3 columns x 4 rows

// Time thresholds for date formatting (in milliseconds)
export const TIME_THRESHOLDS = {
  ONE_MINUTE: 60 * 1000,
  ONE_HOUR: 60 * 60 * 1000,
  ONE_DAY: 24 * 60 * 60 * 1000,
  ONE_WEEK: 7 * 24 * 60 * 60 * 1000,
} as const;

// Content limits
export const DESCRIPTION_MAX_LENGTH = 300;

// Image dimensions
export const PLACEHOLDER_IMAGE = {
  WIDTH: 400,
  HEIGHT: 250,
  ASPECT_RATIO: '16/10' as const,
} as const;

// RSS parsing
export const RSS_CONSTANTS = {
  MIN_XML_LENGTH: 100,
  MAX_ARTICLES: 150,
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes
  FETCH_TIMEOUT: 10 * 1000, // 10 seconds
} as const;
