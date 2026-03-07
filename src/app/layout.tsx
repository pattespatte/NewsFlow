import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

// Get basePath from environment (set by GitHub Pages build)
const basePath = process.env.GITHUB_PAGES === "true" ? "/NewsFlow" : "";

export const metadata: Metadata = {
  title: "NewsFlow - RSS Reader",
  description: "A modern, responsive RSS reader web application. Stay updated with the latest news from multiple trusted sources.",
  keywords: ["RSS", "News", "Reader", "NYT", "BBC", "NPR", "Reuters", "Guardian", "Wired"],
  authors: [{ name: "NewsFlow Team" }],
  manifest: `${basePath}/manifest.json`,
  icons: {
    icon: [
      { url: `${basePath}/favicon.svg`, type: "image/svg+xml" },
      { url: `${basePath}/icon-192.png`, sizes: "192x192", type: "image/png" },
      { url: `${basePath}/icon-512.png`, sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: `${basePath}/apple-touch-icon.png`, sizes: "180x180", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "NewsFlow",
  },
  openGraph: {
    title: "NewsFlow - RSS Reader",
    description: "Your daily news companion - Stay updated with the latest news from multiple trusted sources",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NewsFlow - RSS Reader",
    description: "Your daily news companion - Stay updated with the latest news from multiple trusted sources",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* suppressHydrationWarning prevents errors from browser extensions that modify DOM attributes like data-landmark-index */}
      <head>
        <link rel="icon" href={`${basePath}/favicon.svg`} type="image/svg+xml" />
        <link rel="preconnect" href="https://picsum.photos" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
