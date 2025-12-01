import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-concrete">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="font-serif text-xl text-charcoal">
            Tailor Shift
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/login"
              className="text-caption text-charcoal hover:text-matte-gold"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-matte-gold text-charcoal rounded text-caption font-medium hover:bg-matte-gold/90"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-24 pb-20 px-6">
        <div className="container mx-auto max-w-3xl">
          <h1 className="font-serif text-4xl text-charcoal mb-4">Privacy Policy</h1>
          <p className="text-soft-grey mb-12">Last updated: November 2025</p>

          {/* Introduction */}
          <div className="bg-off-white p-6 rounded-lg mb-12">
            <p className="text-soft-grey">
              At Tailor Shift, we take your privacy seriously. This Privacy Policy explains how we
              collect, use, disclose, and safeguard your information when you use our platform.
              Please read this policy carefully.
            </p>
          </div>

          {/* Table of Contents */}
          <div className="bg-off-white p-6 rounded-lg mb-12">
            <h2 className="font-semibold text-charcoal mb-4">Table of Contents</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#information-we-collect" className="text-matte-gold hover:underline">
                  1. Information We Collect
                </a>
              </li>
              <li>
                <a href="#how-we-use" className="text-matte-gold hover:underline">
                  2. How We Use Your Information
                </a>
              </li>
              <li>
                <a href="#information-sharing" className="text-matte-gold hover:underline">
                  3. Information Sharing and Disclosure
                </a>
              </li>
              <li>
                <a href="#data-security" className="text-matte-gold hover:underline">
                  4. Data Security
                </a>
              </li>
              <li>
                <a href="#data-retention" className="text-matte-gold hover:underline">
                  5. Data Retention
                </a>
              </li>
              <li>
                <a href="#your-rights" className="text-matte-gold hover:underline">
                  6. Your Rights and Choices
                </a>
              </li>
              <li>
                <a href="#cookies" className="text-matte-gold hover:underline">
                  7. Cookies and Tracking
                </a>
              </li>
              <li>
                <a href="#international" className="text-matte-gold hover:underline">
                  8. International Data Transfers
                </a>
              </li>
              <li>
                <a href="#children" className="text-matte-gold hover:underline">
                  9. Children&apos;s Privacy
                </a>
              </li>
              <li>
                <a href="#changes" className="text-matte-gold hover:underline">
                  10. Changes to This Policy
                </a>
              </li>
              <li>
                <a href="#contact" className="text-matte-gold hover:underline">
                  11. Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div className="prose prose-lg max-w-none">
            <section id="information-we-collect" className="mb-12">
              <h2 className="font-serif text-2xl text-charcoal mb-4">1. Information We Collect</h2>
              
              <h3 className="font-semibold text-charcoal mt-6 mb-3">Information You Provide</h3>
              <p className="text-soft-grey leading-relaxed mb-4">
                When you create an account or use our Service, you may provide:
              </p>
              <ul className="list-disc pl-6 text-soft-grey space-y-2">
                <li>
                  <strong>Account Information:</strong> Name, email address, phone number, password
                </li>
                <li>
                  <strong>Profile Information:</strong> Professional history, current role,
                  experience, expertise areas, career preferences, location
                </li>
                <li>
                  <strong>Assessment Responses:</strong> Your answers to the Retail Excellence Scan
                  (note: raw answers are deleted after scoring)
                </li>
                <li>
                  <strong>Compensation Information:</strong> Salary expectations (used only for
                  alignment matching, never disclosed to other parties)
                </li>
                <li>
                  <strong>Brand Information:</strong> Company name, stores, opportunities posted
                </li>
              </ul>

              <h3 className="font-semibold text-charcoal mt-6 mb-3">Information Collected Automatically</h3>
              <ul className="list-disc pl-6 text-soft-grey space-y-2">
                <li>Device information (browser type, operating system)</li>
                <li>IP address and general location</li>
                <li>Usage data (pages visited, features used, time spent)</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section id="how-we-use" className="mb-12">
              <h2 className="font-serif text-2xl text-charcoal mb-4">
                2. How We Use Your Information
              </h2>
              <p className="text-soft-grey leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-soft-grey space-y-2">
                <li>Provide, maintain, and improve our Service</li>
                <li>Process your registration and manage your account</li>
                <li>Generate match scores between Talents and Opportunities</li>
                <li>Provide personalized career insights and recommendations</li>
                <li>Calculate assessment scores and insights</li>
                <li>Facilitate communication between matched parties</li>
                <li>Send service-related communications</li>
                <li>Analyze usage patterns to improve user experience</li>
                <li>Detect and prevent fraud or abuse</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section id="information-sharing" className="mb-12">
              <h2 className="font-serif text-2xl text-charcoal mb-4">
                3. Information Sharing and Disclosure
              </h2>
              
              <h3 className="font-semibold text-charcoal mt-6 mb-3">What We Share</h3>
              <p className="text-soft-grey leading-relaxed mb-4">
                <strong>With Brands (when you&apos;re a Talent):</strong> When there&apos;s mutual interest,
                Brands may see your profile summary, assessment scores, experience blocks, and
                general location. We never share:
              </p>
              <ul className="list-disc pl-6 text-soft-grey space-y-2 mb-4">
                <li>Your exact compensation details (only &quot;alignment&quot; indicator)</li>
                <li>Your current employer&apos;s contact information</li>
                <li>Raw assessment answers</li>
              </ul>

              <p className="text-soft-grey leading-relaxed mb-4">
                <strong>With Talents (when you&apos;re a Brand):</strong> Talents can see your brand
                profile, store information, and opportunity details.
              </p>

              <h3 className="font-semibold text-charcoal mt-6 mb-3">What We Never Sell</h3>
              <p className="text-soft-grey leading-relaxed">
                We do not sell your personal information to third parties. We do not share your
                information for third-party advertising purposes.
              </p>

              <h3 className="font-semibold text-charcoal mt-6 mb-3">Service Providers</h3>
              <p className="text-soft-grey leading-relaxed">
                We may share information with trusted service providers who assist us in operating
                our Service (e.g., hosting, analytics). These providers are contractually obligated
                to protect your information.
              </p>

              <h3 className="font-semibold text-charcoal mt-6 mb-3">Legal Requirements</h3>
              <p className="text-soft-grey leading-relaxed">
                We may disclose information if required by law, court order, or government request,
                or to protect the rights, property, or safety of Tailor Shift, our users, or others.
              </p>
            </section>

            <section id="data-security" className="mb-12">
              <h2 className="font-serif text-2xl text-charcoal mb-4">4. Data Security</h2>
              <p className="text-soft-grey leading-relaxed mb-4">
                We implement industry-standard security measures to protect your information:
              </p>
              <ul className="list-disc pl-6 text-soft-grey space-y-2">
                <li>Encryption in transit (TLS) and at rest</li>
                <li>Secure authentication mechanisms</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Access controls and employee training</li>
                <li>Row-level security (RLS) ensuring users can only access their own data</li>
              </ul>
              <p className="text-soft-grey leading-relaxed mt-4">
                While we strive to protect your information, no method of transmission or storage
                is 100% secure. We cannot guarantee absolute security.
              </p>
            </section>

            <section id="data-retention" className="mb-12">
              <h2 className="font-serif text-2xl text-charcoal mb-4">5. Data Retention</h2>
              <p className="text-soft-grey leading-relaxed mb-4">
                We retain your information for as long as your account is active or as needed to
                provide our services. Specifically:
              </p>
              <ul className="list-disc pl-6 text-soft-grey space-y-2">
                <li>
                  <strong>Profile data:</strong> Retained while account is active, deleted within
                  30 days of account deletion
                </li>
                <li>
                  <strong>Assessment answers:</strong> Deleted immediately after scoring; only
                  aggregate scores are retained
                </li>
                <li>
                  <strong>Usage logs:</strong> Retained for 90 days for analytics
                </li>
                <li>
                  <strong>Backup data:</strong> May persist in encrypted backups for up to 90 days
                </li>
              </ul>
            </section>

            <section id="your-rights" className="mb-12">
              <h2 className="font-serif text-2xl text-charcoal mb-4">6. Your Rights and Choices</h2>
              <p className="text-soft-grey leading-relaxed mb-4">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="list-disc pl-6 text-soft-grey space-y-2">
                <li>
                  <strong>Access:</strong> Request a copy of your personal information
                </li>
                <li>
                  <strong>Correction:</strong> Request correction of inaccurate information
                </li>
                <li>
                  <strong>Deletion:</strong> Request deletion of your information
                </li>
                <li>
                  <strong>Portability:</strong> Request a machine-readable copy of your data
                </li>
                <li>
                  <strong>Opt-out:</strong> Unsubscribe from marketing communications
                </li>
                <li>
                  <strong>Restriction:</strong> Request limited processing of your data
                </li>
              </ul>
              <p className="text-soft-grey leading-relaxed mt-4">
                To exercise these rights, visit your account settings or contact us at{' '}
                <a href="mailto:privacy@tailorshift.com" className="text-matte-gold hover:underline">
                  privacy@tailorshift.com
                </a>
                .
              </p>
            </section>

            <section id="cookies" className="mb-12">
              <h2 className="font-serif text-2xl text-charcoal mb-4">7. Cookies and Tracking</h2>
              <p className="text-soft-grey leading-relaxed mb-4">
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc pl-6 text-soft-grey space-y-2">
                <li>Keep you signed in</li>
                <li>Remember your preferences</li>
                <li>Understand how you use our Service</li>
                <li>Improve user experience</li>
              </ul>
              <p className="text-soft-grey leading-relaxed mt-4">
                You can control cookies through your browser settings. Note that disabling certain
                cookies may affect the functionality of our Service.
              </p>
            </section>

            <section id="international" className="mb-12">
              <h2 className="font-serif text-2xl text-charcoal mb-4">
                8. International Data Transfers
              </h2>
              <p className="text-soft-grey leading-relaxed">
                Your information may be transferred to and processed in countries other than your
                own. We ensure appropriate safeguards are in place for international transfers,
                including standard contractual clauses where required by law.
              </p>
            </section>

            <section id="children" className="mb-12">
              <h2 className="font-serif text-2xl text-charcoal mb-4">9. Children&apos;s Privacy</h2>
              <p className="text-soft-grey leading-relaxed">
                Our Service is not intended for individuals under the age of 18. We do not
                knowingly collect information from children. If you believe we have collected
                information from a child, please contact us immediately.
              </p>
            </section>

            <section id="changes" className="mb-12">
              <h2 className="font-serif text-2xl text-charcoal mb-4">10. Changes to This Policy</h2>
              <p className="text-soft-grey leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of
                material changes by posting the new policy on this page and updating the &quot;Last
                updated&quot; date. We encourage you to review this policy periodically.
              </p>
            </section>

            <section id="contact" className="mb-12">
              <h2 className="font-serif text-2xl text-charcoal mb-4">11. Contact Us</h2>
              <p className="text-soft-grey leading-relaxed">
                If you have questions or concerns about this Privacy Policy or our data practices,
                please contact us:
              </p>
              <div className="mt-4 p-4 bg-off-white rounded-lg">
                <p className="text-charcoal">
                  <strong>Tailor Shift - Privacy Team</strong>
                </p>
                <p className="text-soft-grey">Email: privacy@tailorshift.com</p>
                <p className="text-soft-grey mt-2 text-sm">
                  For EU residents, you also have the right to lodge a complaint with your local
                  supervisory authority.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-concrete bg-off-white px-6 py-12">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-caption text-soft-grey">
              © {new Date().getFullYear()} Tailor Shift. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                href="/terms"
                className="text-caption text-soft-grey hover:text-charcoal"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="text-caption text-charcoal font-medium"
              >
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
