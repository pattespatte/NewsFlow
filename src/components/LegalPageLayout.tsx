interface LegalPageLayoutProps {
  title: string;
  children: React.ReactNode;
  lastUpdated?: string;
}

const LAST_UPDATED = "2026-03-07";

export function LegalPageLayout({ title, children, lastUpdated }: LegalPageLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">{title}</h1>
        {children}
        {lastUpdated && (
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Last updated: {lastUpdated}
            </p>
          </div>
        )}
      </main>

      <footer className="border-t py-4 mt-8 bg-muted/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <a href="/" className="hover:underline">
            ← Back to NewsFlow
          </a>
        </div>
      </footer>
    </div>
  );
}

LegalPageLayout.LastUpdated = LAST_UPDATED;
