# 📰 NewsFlow RSS Reader

A modern, beautiful RSS reader web application built with Next.js 16, featuring news from 12 major sources including NYT, BBC, NBC, ABC, CBS, Al Jazeera, NPR, The Guardian, and Wired.

![NewsFlow](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat&logo=tailwind-css)

## ✨ Features

### 🌍 News Sources

- **NYT** - Top Stories, World, Technology, Business feeds
- **BBC** - World News
- **NBC News** - Latest headlines
- **ABC News** - Top Stories
- **CBS News** - Latest News
- **Al Jazeera** - International coverage
- **NPR** - US News
- **The Guardian** - World News
- **Wired** - Technology & Culture

### 🎨 User Experience

- **Article Deduplication** - Smart URL-based deduplication prevents duplicate articles from multiple sources
- **Search & Filter** - Full-text search across all articles with source filtering
- **Bookmarks** - Save articles for later reading with localStorage persistence
- **Dark/Light Mode** - Beautiful theme switching with system preference detection
- **Responsive Design** - Mobile-first design that works on all devices
- **PWA Support** - Install as a home screen app on mobile devices

### 🔧 Technical Features

- **External RSS API** - Server-side RSS fetching with 5-minute caching (deployed separately)
- **HTML Entity Decoding** - Properly handles all HTML entities including numeric ones
- **Image Extraction** - Pulls article images from RSS feeds (media:content, enclosures, content:encoded)
- **Click-to-Read** - Entire article cards are clickable to open full articles
- **Pagination** - Load more articles on demand for better performance
- **Error Handling** - Graceful error messages when feeds fail to load
- **Optimized Dependencies** - Only ~520MB node_modules (down from 1GB+)

## 🚀 Quick Start

```bash
# Install dependencies
bun install

# Start development server (includes local API)
bun run dev

# Build for production (static export)
bun run build
```

Visit [http://localhost:3000](http://localhost:3000) to see your RSS reader running.

## 🚢 Deployment

NewsFlow uses a split architecture:

- **Frontend**: Static site deployed to GitHub Pages
- **API**: Serverless RSS fetching deployed to Vercel

### Step 1: Deploy the API to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "Add New Project" → "Import Git Repository"
3. Select your NewsFlow repository
4. **Important**: Set "Root Directory" to `api-server`
5. Click "Deploy"
6. Copy the deployed API URL (e.g., `https://your-api.vercel.app`)

### Step 2: Configure GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Build and deployment", set Source to **GitHub Actions**

### Step 3: Set API URL in GitHub Secrets

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `API_URL`
4. Value: Your Vercel API URL (e.g., `https://your-api.vercel.app`)

### Step 4: Push to Deploy

Push your changes to the `main` branch. The GitHub Action will automatically:

1. Build the static site
2. Deploy to GitHub Pages

Your app will be available at `https://pattespatte.github.io/NewsFlow/`

## 📁 Project Structure

```
├── api-server/                    # Vercel API deployment
│   ├── api/
│   │   └── route.ts              # RSS feed fetching API
│   ├── src/
│   │   ├── lib/
│   │   │   ├── constants.ts      # API constants
│   │   │   ├── rss.ts            # RSS parsing
│   │   │   ├── sources.ts        # News sources config
│   │   │   └── utils.ts          # Helpers
│   │   └── types/
│   │       └── article.ts        # TypeScript types
│   ├── package.json
│   ├── next.config.ts
│   └── tsconfig.json
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root layout with theme provider
│   │   ├── page.tsx              # Main application page
│   │   └── globals.css           # Global styles and theme variables
│   ├── components/
│   │   ├── Header.tsx            # App header with search and theme toggle
│   │   ├── ArticleCard.tsx       # Individual article card component
│   │   ├── SourceTabs.tsx        # Source filter tabs
│   │   ├── LoadingSkeleton.tsx   # Loading state skeleton
│   │   ├── ThemeProvider.tsx     # Theme provider component
│   │   └── ThemeToggle.tsx       # Dark/light mode toggle button
│   │   └── ui/                   # shadcn/ui components
│   ├── hooks/
│   │   ├── use-mobile.ts         # Mobile detection hook
│   │   └── use-toast.ts          # Toast notification hook
│   ├── lib/
│   │   ├── constants.ts          # App constants (includes API_URL)
│   │   ├── rss.ts                # RSS parsing utilities
│   │   ├── sources.ts            # News source configurations
│   │   └── utils.ts              # Helper functions
│   └── types/
│       └── article.ts            # TypeScript interfaces
├── .github/
│   └── workflows/
│       └── deploy.yml            # GitHub Pages deployment workflow
├── next.config.ts                # Next.js config (static export)
└── package.json
```

## 🛠️ Technologies Used

- **Next.js 16** - React framework with App Router
- **TypeScript 5** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **shadcn/ui** - High-quality UI components
- **Lucide React** - Icon library
- **next-themes** - Theme management
- **Framer Motion** - Animations
- **Sonner** - Toast notifications
- **Vercel** - API hosting (free tier)
- **GitHub Pages** - Static site hosting (free)

## 📱 PWA Features

NewsFlow is built as a Progressive Web App (PWA):

- Installable on mobile devices
- Service worker for offline capability
- App icons in multiple sizes (192x192, 512x512, 1024x1024)
- Responsive mobile-first design
- Touch-optimized interface

## 🔧 Configuration

### Adding New News Sources

Edit `src/lib/sources.ts` (and `api-server/src/lib/sources.ts` for the API):

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

Edit `src/lib/constants.ts` (and `api-server/src/lib/constants.ts` for the API):

```typescript
RSS_CONSTANTS: {
  MIN_XML_LENGTH: 100,
  MAX_ARTICLES: 150,
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes
  FETCH_TIMEOUT: 10 * 1000, // 10 seconds
} as const;
```

### Local Development with External API

For local development using an external API:

```bash
# Create .env.local file
echo "NEXT_PUBLIC_API_URL=https://your-api.vercel.app" > .env.local

# Then run dev server
bun run dev
```

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- News sources mentioned above for their RSS feeds
- shadcn/ui for the beautiful UI components
- Next.js team for the amazing framework
