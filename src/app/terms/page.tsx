import { LegalPageLayout } from '@/components/LegalPageLayout';

export default function TermsPage() {
  return (
    <LegalPageLayout
      title="Terms of Service"
      lastUpdated={LegalPageLayout.LastUpdated}
    >
      <section className="prose prose-sm dark:prose-invert space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">1. Nature of Service</h2>
          <p className="text-muted-foreground">
            NewsFlow is a personal news aggregator that displays article previews from publicly available RSS feeds.
            We do not create, own, or endorse any of the content displayed on this platform.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">2. Content Ownership</h2>
          <p className="text-muted-foreground">
            All articles, images, and content displayed on NewsFlow belong to their respective publishers and sources.
            This includes but is not limited to: The New York Times, BBC, NBC News, ABC News, CBS News, Al Jazeera,
            NPR, The Guardian, and Wired.
          </p>
          <p className="text-muted-foreground mt-2">
            We display article excerpts (titles, descriptions, and thumbnails) solely for the purpose of helping
            users discover and navigate to original content. All rights remain with the content creators.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">3. Permitted Use</h2>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1">
            <li>Personal, non-commercial use of this service</li>
            <li>Reading article previews and linking to original sources</li>
            <li>Saving bookmarks for personal use (stored locally on your device)</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">4. Prohibited Use</h2>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1">
            <li>Commercial use or reproduction of aggregated content</li>
            <li>Scraping or redistributing content from this site</li>
            <li>Removing attribution or source links</li>
            <li>Using this service in any way that infringes on the rights of content creators</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">5. RSS Feed Usage</h2>
          <p className="text-muted-foreground">
            We use RSS feeds provided by news organizations for the purpose of aggregation. If you are a content
            owner and wish to have your content removed, please contact us. We will promptly address any takedown
            requests.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">6. Disclaimer of Warranties</h2>
          <p className="text-muted-foreground">
            This service is provided "as is" without warranties of any kind. We do not guarantee availability,
            accuracy, or completeness of content. Article links may expire or become unavailable.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">7. Changes to Terms</h2>
          <p className="text-muted-foreground">
            We reserve the right to modify these terms at any time. Continued use of the service constitutes
            acceptance of any changes.
          </p>
        </div>
      </section>
    </LegalPageLayout>
  );
}
