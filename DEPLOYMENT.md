# Deployment Guide

This guide walks through deploying NewsFlow RSS Reader to GitHub Pages with the API hosted on Vercel.

## Prerequisites

- GitHub account with the repository already created
- Vercel account (free tier works fine)
- Git installed locally

## Architecture Overview

```
┌─────────────────────┐         ┌──────────────────────┐
│   GitHub Pages      │         │   Vercel API         │
│   (Static Site)     │◄────────┤   (RSS Fetching)     │
│                     │         │                      │
│  - Frontend assets  │         │  - /api/rss endpoint │
│  - index.html       │         │  - Caching           │
│  - CSS, JS          │         │  - Deduplication     │
└─────────────────────┘         └──────────────────────┘
       https://pattespatte.github.io/NewsFlow/
                                         │
                                         ▼
                            https://your-api.vercel.app/api/rss
                                         │
                                         ▼
                            ┌──────────────────────────┐
                            │   RSS Feeds              │
                            │   - NYT, BBC, NBC, etc.  │
                            └──────────────────────────┘
```

## Step 1: Deploy API to Vercel

### 1.1 Connect Vercel to GitHub

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up" or "Log In"
3. Choose "Continue with GitHub" and authorize Vercel

### 1.2 Import the Repository

1. Click "Add New Project" → "Import Git Repository"
2. Find and select `pattespatte/NewsFlow`
3. **Important**: Set "Root Directory" to `api-server`
4. Click "Import"

### 1.3 Configure Root Directory (Important)

1. After importing, go to **Settings** → **General**
2. Find the **Root Directory** field
3. Set it to `api-server`
4. Click **Save**

This ensures Vercel builds the API server from the correct subdirectory.

### 1.4 Configure Environment (Optional)

The API doesn't require any environment variables. Vercel will auto-detect Next.js.

### 1.4 Deploy

1. Click "Deploy"
2. Wait for the deployment to complete (~1-2 minutes)
3. Copy your API URL (e.g., `https://newsflow-api.vercel.app`)

## Step 2: Configure GitHub Pages

### 2.1 Enable GitHub Actions

1. Go to https://github.com/pattespatte/NewsFlow/settings/pages
2. Under "Build and deployment", set **Source** to **GitHub Actions**
3. A warning may appear - this is normal, continue to next step

### 2.2 Add API URL Secret

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. **Name**: `API_URL`
4. **Value**: Your Vercel API URL (e.g., `https://newsflow-api.vercel.app`)
5. Click **Add secret**

## Step 3: Deploy Frontend

### 3.1 Push Changes

The `.github/workflows/deploy.yml` workflow will automatically run on every push to `main`:

```bash
git add .
git commit -m "Configure GitHub Pages deployment"
git push origin main
```

### 3.2 Monitor Deployment

1. Go to the **Actions** tab in your repository
2. Click on the "Deploy to GitHub Pages" workflow
3. Wait for the workflow to complete (~2-3 minutes)

### 3.3 Access Your Site

Once complete, your site will be available at:
```
https://pattespatte.github.io/NewsFlow/
```

## Local Development with External API

To test the production API locally:

```bash
# Create .env.local
echo "NEXT_PUBLIC_API_URL=https://your-api.vercel.app" > .env.local

# Run dev server
bun run dev
```

The app will use the external API instead of the local one.

## Troubleshooting

### API returns 404

- Verify the Vercel deployment completed successfully
- Check the API URL in GitHub Actions secrets matches your Vercel URL
- Ensure the root directory on Vercel is set to `api-server`

### GitHub Pages shows 404

- Verify GitHub Actions workflow completed successfully
- Check that GitHub Pages source is set to "GitHub Actions"
- Wait a few minutes for DNS propagation

### Articles not loading

- Open browser DevTools → Network tab
- Check if `/api/rss` requests are being made
- Verify the API URL is correct (should be your Vercel URL)
- Check the API deployment logs on Vercel

### CORS errors

If you see CORS errors in the browser console:
- Verify the API server code in `api-server/app/api/rss/route.ts` has CORS headers
- Ensure the Vercel API deployment has completed (check Vercel dashboard)
- Confirm the Root Directory in Vercel is set to `api-server`
- Try redeploying the API server from Vercel dashboard

To check if CORS headers are present:
```bash
curl -I https://your-api.vercel.app/api/rss
# Look for: Access-Control-Allow-Origin: *
```

## Updating Deployed App

### Update Frontend

1. Make changes to the code
2. Commit and push to `main` branch
3. GitHub Actions will automatically redeploy

### Update API

1. Make changes to files in `api-server/`
2. Commit and push to `main` branch
3. Vercel will automatically redeploy

### Update Both

1. Make changes
2. Commit and push
3. Both GitHub Actions and Vercel will deploy simultaneously

## Costs

- **GitHub Pages**: Free (static hosting)
- **Vercel**: Free tier includes:
  - 100GB bandwidth per month
  - Serverless Function executions
  - SSL certificate
  - CDN distribution

Total cost: **$0/month**

## Monitoring

### GitHub Pages

- Check the **Actions** tab for deployment status
- View **Settings** → **Pages** for deployment history

### Vercel

- Go to your Vercel dashboard
- View project for real-time logs
- Analytics for request counts and response times
