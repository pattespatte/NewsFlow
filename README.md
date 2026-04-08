# NewsFlow RSS Reader

A modern, beautiful RSS reader web application built with Next.js 16, featuring news from 24 sources including NYT, BBC, NBC, ABC, CBS, Al Jazeera, NPR, The Guardian, Wired, and more.

![NewsFlow](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat&logo=tailwind-css)

## Features

### News Sources

- **NYT** - Top Stories, World, Technology, Business
- **BBC** - World News
- **NBC News** - Latest headlines
- **ABC News** - Top Stories
- **CBS News** - Latest News
- **The Atlantic** - Culture & Politics
- **Al Jazeera** - International coverage
- **NPR** - US News, Politics
- **The Guardian** - World News
- **Wired** - Technology & Culture
- **Ars Technica** - Technology
- **The Hill** - Political News
- **Pew Research** - Research & Data
- **POLITICO** - Politics
- **Axios** - News & Analysis
- **The Intercept** - Investigative Journalism
- **Deutsche Welle** - International
- **Foreign Policy** - Global Affairs
- **Time** - News & Analysis
- **Independent** - World News

### User Experience

- **Article Deduplication** - Smart URL-based deduplication prevents duplicate articles from multiple sources
- **Search & Filter** - Full-text search across all articles with source filtering
- **Bookmarks** - Save articles for later reading with localStorage persistence
- **Dark/Light Mode** - Beautiful theme switching with system preference detection
- **Responsive Design** - Mobile-first design that works on all devices
- **PWA Support** - Install as a home screen app on mobile devices

### Technical Features

- **Server-Side RSS Fetching** - API routes fetch and parse RSS feeds with 5-minute caching
- **HTML Entity Decoding** - Properly handles all HTML entities including numeric ones
- **Image Extraction** - Pulls article images from RSS feeds (media:content, enclosures, content:encoded, og:image)
- **Click-to-Read** - Entire article cards are clickable to open full articles
- **Pagination** - Load more articles on demand for better performance
- **Source Performance** - Timing dialog shows fetch performance per source

## Quick Start

```bash
# Install dependencies
bun install

# Start development server
bun run dev
```

Visit [http://localhost:3000](http://localhost:3000). The API runs on the same server.

### Production Build

```bash
bun run build
bun run start
```

## Deployment

NewsFlow supports two deployment modes:

### Standalone (Vercel / Node.js)

The default `bun run build` produces a standalone server. Deploy to Vercel directly or run with Node/Bun.

### Static Export (GitHub Pages)

Set `GITHUB_PAGES=true` to produce a static export. The GitHub Actions workflow (`.github/workflows/deploy.yml`) handles this automatically:

1. Removes API routes (not compatible with static export)
2. Builds with `GITHUB_PAGES=true` and your `API_URL` secret
3. Deploys to GitHub Pages

The static site redirects to the Vercel deployment (which has the API routes).

## Project Structure

```
src/
  app/
    api/
      rss/
        route.ts            # RSS feed fetching API (server-side)
    layout.tsx              # Root layout with theme provider
    page.tsx                # Main application page
    globals.css             # Global styles and theme variables
  components/
    Header.tsx              # App header with search and theme toggle
    ArticleCard.tsx         # Individual article card component
    SourceTabs.tsx           # Source filter tabs
    LoadingSkeleton.tsx     # Loading state skeleton
    ClientTime.tsx          # Client-side time rendering
    LegalPageLayout.tsx     # Terms/privacy page layout
    ThemeProvider.tsx       # Theme provider component
    ThemeToggle.tsx         # Dark/light mode toggle button
    ui/                     # shadcn/ui components
  hooks/
    use-mobile.ts           # Mobile detection hook
  lib/
    constants.ts            # App constants
    rss.ts                  # RSS parsing utilities
    sources.ts              # News source configurations
    utils.ts                # Helper functions
  types/
    article.ts              # TypeScript interfaces
```

## Technologies Used

- **Next.js 16** - React framework with App Router
- **TypeScript 5** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **shadcn/ui** - High-quality UI components
- **Lucide React** - Icon library
- **next-themes** - Theme management
- **Vercel** - API hosting (free tier)
- **GitHub Pages** - Static site hosting (free)

## Configuration

### Adding New News Sources

Edit `src/lib/sources.ts`:

```typescript
{
  id: 'your-source',
  name: 'Your Source Name',
  url: 'https://example.com/feed.rss',
  color: '#CC0000',
  bgColor: '#FEF2F2',
}
```

### Adjusting Cache Settings

Edit `src/lib/constants.ts`:

```typescript
RSS_CONSTANTS: {
  MIN_XML_LENGTH: 100,
  MAX_ARTICLES: 150,
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes
  FETCH_TIMEOUT: 10 * 1000, // 10 seconds
} as const;
```

### API URL Override

Set `NEXT_PUBLIC_API_URL` in `.env.local` to point to an external API:

```bash
echo "NEXT_PUBLIC_API_URL=https://your-api.vercel.app/" > .env.local
```

## PWA Features

- Installable on mobile devices
- App icons in multiple sizes (192x192, 512x512, 1024x1024)
- Responsive mobile-first design

## License

This project is open source and available under the MIT License.
