export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

        <section className="prose prose-sm dark:prose-invert space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">1. Data We Collect</h2>
            <p className="text-muted-foreground">
              <strong>We do not collect, store, or transmit any personal data.</strong>
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1 mt-2">
              <li>No user accounts or authentication</li>
              <li>No email addresses or personal information</li>
              <li>No tracking or analytics cookies</li>
              <li>No server-side data storage</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">2. Local Storage Only</h2>
            <p className="text-muted-foreground">
              The only data stored by NewsFlow is your saved article bookmarks, which are stored <strong>locally
              on your device</strong> using your browser's localStorage. This means:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1 mt-2">
              <li>Bookmarks never leave your device</li>
              <li>We have no access to your bookmarks</li>
              <li>Clearing your browser data will remove your bookmarks</li>
              <li>Bookmarks are not synchronized across devices</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">3. API Requests</h2>
            <p className="text-muted-foreground">
              When you use NewsFlow, your browser makes requests to our API server to fetch article previews.
              These requests are used solely to retrieve RSS feed data and do not include any personal information.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">4. Third-Party Content</h2>
            <p className="text-muted-foreground">
              NewsFlow displays article previews and links to external news sources. When you click on an article,
              you leave NewsFlow and visit the original publisher's website. Those publishers have their own
              privacy policies which we encourage you to review.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">5. Images and Media</h2>
            <p className="text-muted-foreground">
              Article thumbnails and images are loaded directly from the original publishers' servers. We do not
              proxy or cache these images.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">6. Children's Privacy</h2>
            <p className="text-muted-foreground">
              NewsFlow is not directed to children under 13. We do not knowingly collect information from children
              under 13.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">7. Your Rights</h2>
            <p className="text-muted-foreground">
              Since we don't collect any personal data, there is no data for us to delete, export, or modify.
              Your bookmarks are entirely under your control and can be removed at any time by clearing your
              browser's local storage or using the bookmark feature in the app.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">8. California Residents (CCPA)</h2>
            <p className="text-muted-foreground">
              Under the California Consumer Privacy Act (CCPA), California residents have the right to know what
              personal information is collected and request its deletion. Since we do not collect any personal
              information, these rights do not apply.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">9. European Residents (GDPR)</h2>
            <p className="text-muted-foreground">
              Since we do not collect, process, or store any personal data, NewsFlow does not process personal data
              under the General Data Protection Regulation (GDPR). No data controllers or data processors are
              involved in the operation of this service.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">10. Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this privacy policy from time to time. Any changes will be posted on this page.
            </p>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t py-4 mt-8 bg-muted/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <a href="/" className="hover:underline">← Back to NewsFlow</a>
        </div>
      </footer>
    </div>
  );
}
