import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated: February 2026
      </p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
        <section>
          <h2>1. Information We Collect</h2>
          <p>
            When you use ScopeAI, we collect the following information:
          </p>
          <ul className="mt-2">
            <li>
              <strong>Account information:</strong> Your email address and name
              when you create an account.
            </li>
            <li>
              <strong>Project data:</strong> Photos you upload, answers to
              project questions, property details, and generated scope documents.
            </li>
            <li>
              <strong>Payment information:</strong> Payment details are processed
              securely by Stripe. We store your payment tier and transaction
              reference, not your card details.
            </li>
            <li>
              <strong>Usage data:</strong> Basic analytics to understand how the
              service is used and improve it.
            </li>
          </ul>
        </section>

        <section>
          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>To generate renovation scope-of-works documents based on your inputs.</li>
            <li>To process payments and deliver your purchased documents.</li>
            <li>To send transactional emails (scope delivery, receipts) via Resend.</li>
            <li>To improve our service and fix issues.</li>
          </ul>
        </section>

        <section>
          <h2>3. Third-Party Services</h2>
          <p>We use the following third-party services to operate ScopeAI:</p>
          <ul className="mt-2">
            <li>
              <strong>Google Gemini API:</strong> Your photos and project details
              are sent to Google&apos;s Gemini AI to generate scope documents. Google&apos;s
              privacy policy applies to this processing.
            </li>
            <li>
              <strong>Stripe:</strong> Handles payment processing. Your payment
              information is subject to Stripe&apos;s privacy policy.
            </li>
            <li>
              <strong>Convex:</strong> Our database and backend provider. Your
              data is stored securely on Convex infrastructure.
            </li>
            <li>
              <strong>Resend:</strong> Delivers transactional emails on our
              behalf.
            </li>
            <li>
              <strong>Vercel:</strong> Hosts the ScopeAI website.
            </li>
          </ul>
        </section>

        <section>
          <h2>4. Data Storage &amp; Security</h2>
          <p>
            Your data is stored securely using industry-standard practices. Photos
            are stored in Convex file storage. We do not sell or share your personal
            information with third parties for marketing purposes.
          </p>
        </section>

        <section>
          <h2>5. Data Retention &amp; Deletion</h2>
          <p>
            Your project data is retained for as long as your account is active. You
            can delete your account and all associated data at any time from your
            account settings. Upon deletion, all photos, projects, scopes, and
            documents are permanently removed.
          </p>
        </section>

        <section>
          <h2>6. Your Rights</h2>
          <p>
            Under Australian privacy law, you have the right to access, correct,
            or delete your personal information. To exercise these rights, use the
            account settings page or contact us at the address below.
          </p>
        </section>

        <section>
          <h2>7. Contact</h2>
          <p>
            If you have questions about this privacy policy, contact us at{" "}
            <a
              href="mailto:privacy@scopeai.com.au"
              className="text-primary underline underline-offset-2"
            >
              privacy@scopeai.com.au
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
