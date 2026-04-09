import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface ImageRequest {
  urls: string[];
}

async function fetchOgImage(articleUrl: string): Promise<string | undefined> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(articleUrl, {
      headers: {
        'Accept': 'text/html',
        'User-Agent': 'Mozilla/5.0 (compatible; NewsFlowRSS/1.0)',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) return undefined;

    const html = await response.text();

    // Try pattern 1: <meta property="og:image" content="...">
    let match = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
    // Try pattern 2: <meta content="..." property="og:image">
    if (!match) {
      match = html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    }

    if (match) {
      return match[1].replace(/&amp;/g, '&');
    }

    return undefined;
  } catch {
    return undefined;
  }
}

export async function POST(request: Request) {
  let body: ImageRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ images: {} }, { status: 400 });
  }

  const { urls } = body;
  if (!Array.isArray(urls) || urls.length === 0) {
    return NextResponse.json({ images: {} });
  }

  // Cap at 30 URLs to prevent abuse
  const cappedUrls = urls.slice(0, 30);

  const results = await Promise.all(
    cappedUrls.map(async (url: string) => {
      const imageUrl = await fetchOgImage(url);
      return { url, imageUrl };
    })
  );

  const images: Record<string, string | undefined> = {};
  for (const { url, imageUrl } of results) {
    if (imageUrl) {
      images[url] = imageUrl;
    }
  }

  return NextResponse.json(
    { images },
    {
      headers: {
        'Cache-Control': 'public, max-age=600',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}
