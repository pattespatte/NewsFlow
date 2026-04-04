# Deployment Guide

This guide walks through deploying NewsFlow RSS Reader to GitHub Pages with the API hosted on Vercel.

## Prerequisites

- GitHub account with the repository already created
- Vercel account (free tier works fine)
- Git installed locally

## Architecture Overview

```
┌─────────────────────┐         ┌──────────────────────┐
│   GitHub Pages      │         │   Vercel             │
│   (Static Site)     │◄────────┤   (RSS API)          │
│                     │         │                      │
│  - Frontend assets  │         │  - /api/rss endpoint │
│  - index.html       │         │  - Caching           │
│  - CSS, JS          │         │  - Deduplication     │
└─────────────────────┘         └──────────────────────┘
       https://YOUR_USERNAME.github.io/YOUR_REPO/
                                         │
                                         ▼
                            https://YOUR_PROJECT.vercel.app/api/rss
                                         │
                                         ▼
                            ┌──────────────────────────┐
                            │   RSS Feeds              │
                            │   - NYT, BBC, NBC, etc.  │
                            └──────────────────────────┘
```

## Step 1: Deploy to Vercel

The RSS API is built into the main Next.js app at `src/app/api/rss/route.ts`.

### 1.1 Connect Vercel to GitHub

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up" or "Log In"
3. Choose "Continue with GitHub" and authorize Vercel

### 1.2 Import the Repository

1. Click "Add New Project" → "Import Git Repository"
2. Find and select your repository
3. Click "Import" (root directory stays as default `.`)

### 1.3 Deploy

1. Click "Deploy"
2. Wait for the deployment to complete (~1-2 minutes)
3. Copy your API URL (e.g., `https://your-project.vercel.app`)

## Step 2: Configure GitHub Pages

### 2.1 Enable GitHub Actions

1. Go to your repository **Settings** → **Pages**
2. Under "Build and deployment", set **Source** to **GitHub Actions**

### 2.2 Add API URL Secret

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. **Name**: `API_URL`
4. **Value**: Your Vercel API URL (e.g., `https://your-project.vercel.app`)
5. Click **Add secret**

## Step 3: Deploy Frontend

The `.github/workflows/deploy.yml` workflow runs automatically on every push to `main`. It strips the API routes before building the static export.

### Access Your Site

```
https://YOUR_USERNAME.github.io/YOUR_REPO/
```

## Local Development

The app uses the local API by default (`/api/rss`). To test with the production API:

```bash
echo "NEXT_PUBLIC_API_URL=https://your-project.vercel.app" > .env.local
bun run dev
```

## Troubleshooting

### API returns 404

- Verify the Vercel deployment completed successfully
- Check the API URL in GitHub Actions secrets matches your Vercel URL

### GitHub Pages shows 404

- Verify GitHub Actions workflow completed successfully
- Check that GitHub Pages source is set to "GitHub Actions"
- Wait a few minutes for DNS propagation

### Articles not loading

- Open browser DevTools → Network tab
- Check if `/api/rss` requests are being made
- Verify the API URL is correct

### CORS errors

```bash
curl -I https://your-project.vercel.app/api/rss
# Look for: Access-Control-Allow-Origin: *
```

## Costs

- **GitHub Pages**: Free (static hosting)
- **Vercel**: Free tier includes 100GB bandwidth/month, serverless functions, SSL, CDN

Total cost: **$0/month**
