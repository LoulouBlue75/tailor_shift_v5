import Link from 'next/link'

export default function TermsPage() {
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
          <h1 className="font-serif text-4xl text-charcoal mb-4">Terms of Service</h1>
          <p className="text-soft-grey mb-12">Last updated: November 2025</p>

          {/* Table of Contents */}
          <div className="bg-off-white p-6 rounded-lg mb-12">
            <h2 className="font-semibold text-charcoal mb-4">Table of Contents</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#acceptance" className="text-matte-gold hover:underline">
                  1. Acceptance of Terms
                </a>
              </li>
              <li>
                <a href="#description" className="text-matte-gold hover:underline">
                  2. Description of Service
                </a>
              </li>
              <li>
                <a href="#accounts" className="text-matte-gold hover:underline">
                  3. User Accounts
                </a>
              </li>
              <li>
                <a href="#conduct" className="text-matte-gold hover:underline">
                  4. User Conduct
                </a>
              </li>
              <li>
                <a href="#content" className="text-matte-gold hover:underline">
                  5. Content and Intellectual Property
                </a>
              </li>
              <li>
                <a href="#privacy" className="text-matte-gold hover:underline">
                  6. Privacy
                </a>
              </li>
              <li>
                <a href="#disclaimers" className="text-matte-gold hover:underline">
                  7. Disclaimers
                </a>
              </li>
              <li>
                <a href="#limitation" className="text-matte-gold hover:underline">
                  8. Limitation of Liability
                </a>
              </li>
              <li>
                <a href="#termination" className="text-matte-gold hover:underline">
                  9. Termination
                </a>
              </li>
              <li>
                <a href="#changes" className="text-matte-gold hover:underline">
                  10. Changes to Terms
                </a>
              </li>
              <li>
                <a href="#contact" className="text-matte-gold hover:underline">
                  11. Contact Information
                </a>
              </li>
            </ul>
          </div>

          <div className="prose prose-lg max-w-none">
            <section id="acceptance" className="mb-12">
              <h2 className="font-serif text-2xl text-charcoal mb-4">1. Acceptance of Terms</h2>
              <p className="text-soft-grey leading-relaxed">
                By accessing or using the Tailor Shift platform (&quot;Service&quot;), you agree to be bound
                by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, you may
                not access or use the Service. These Terms constitute a legally binding agreement
                between you and Tailor Shift.
              </p>
            </section>

            <section id="description" className="mb-12">
              <h2 className="font-serif text-2xl text-charcoal mb-4">2. Description of Service</h2>
              <p className="text-soft-grey leading-relaxed mb-4">
                Tailor Shift is an intelligent matching platform that connects luxury retail
                professionals (&quot;Talents&quot;) with luxury brands and maisons (&quot;Brands&quot;). Our Service
                includes:
              </p>
              <ul className="list-disc pl-6 text-soft-grey space-y-2">
                <li>Profile creation and management for Talents and Brands</li>
                <li>Capability assessment tools (Retail Excellence Scan)</li>
                <li>Intelligent matching algorithm connecting Talents with Opportunities</li>
                <li>Career development insights and learning recommendations</li>
                <li>Communication facilitation between matched parties</li>
              </ul>
            </section>

            <section id="accounts" className="mb-12">
              <h2 className="font-serif text-2xl text-charcoal mb-4">3. User Accounts</h2>
              <p className="text-soft-grey leading-relaxed mb-4">
                To use certain features of the Service, you must create an account. You agree to:
              </p>
              <ul className="list-disc pl-6 text-soft-grey space-y-2">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Promptly update any information that becomes inaccurate</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized access</li>
              </ul>
              <p className="text-soft-grey leading-relaxed mt-4">
                You may not create multiple accounts or share your account with others. We reserve
                the right to suspend or terminate accounts that violate these Terms.
              </p>
            </section>

            <section id="conduct" className="mb-12">
              <h2 className="font-serif text-2xl text-charcoal mb-4">4. User Conduct</h2>
              <p className="text-soft-grey leading-relaxed mb-4">
                You agree not to use the Service to:
              </p>
              <ul className="list-disc pl-6 text-soft-grey space-y-2">
                <li>Provide false or misleading information about yourself or your organization</li>
                <li>Impersonate any person or entity</li>
                <li>Harass, abuse, or discriminate against other users</li>
                <li>Send unsolicited communications or spam</li>
                <li>Attempt to circumvent security measures or access unauthorized data</li>
                <li>Use automated tools to scrape or collect user data</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Interfere with the proper functioning of the Service</li>
              </ul>
            </section>

            <section id="content" className="mb-12">
              <h2 className="font-serif text-2xl text-charcoal mb-4">
                5. Content and Intellectual Property
              </h2>
              <p className="text-soft-grey leading-relaxed mb-4">
                <strong>Your Content:</strong> You retain ownership of content you submit to the
                Service. By submitting content, you grant Tailor Shift a non-exclusive, worldwide,
                royalty-free license to use, display, and distribute that content in connection
                with the Service.
              </p>
              <p className="text-soft-grey leading-relaxed mb-4">
                <strong>Our Content:</strong> The Service, including its design, features, and
                content created by Tailor Shift, is protected by copyright, trademark, and other
                intellectual property laws. You may not copy, modify, or distribute our content
                without express written permission.
              </p>
              <p className="text-soft-grey leading-relaxed">
                <strong>Assessment Content:</strong> The Retail Excellence Scan and related
                assessment materials are proprietary to Tailor Shift. You may not reproduce,
                distribute, or create derivative works from these materials.
              </p>
            </section>

            <section id="privacy" className="mb-12">
              <h2 className="font-serif text-2xl text-charcoal mb-4">6. Privacy</h2>
              <p className="text-soft-grey leading-relaxed">
                Your privacy is important to us. Our collection and use of personal information is
                governed by our{' '}
                <Link href="/privacy" className="text-matte-gold hover:underline">
                  Privacy Policy
                </Link>
                , which is incorporated into these Terms by reference. By using the Service, you
                consent to the collection and use of information as described in the Privacy Policy.
              </p>
            </section>

            <section id="disclaimers" className="mb-12">
              <h2 className="font-serif text-2xl text-charcoal mb-4">7. Disclaimers</h2>
              <p className="text-soft-grey leading-relaxed mb-4">
                THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND,
                EITHER EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO:
              </p>
              <ul className="list-disc pl-6 text-soft-grey space-y-2">
                <li>Warranties of merchantability and fitness for a particular purpose</li>
                <li>Warranties that the Service will be uninterrupted or error-free</li>
                <li>Warranties regarding the accuracy of match results or assessments</li>
                <li>Warranties regarding employment outcomes or hiring decisions</li>
              </ul>
              <p className="text-soft-grey leading-relaxed mt-4">
                Tailor Shift does not guarantee employment or hiring. We facilitate connections
                but are not responsible for decisions made by Talents or Brands.
              </p>
            </section>

            <section id="limitation" className="mb-12">
              <h2 className="font-serif text-2xl text-charcoal mb-4">8. Limitation of Liability</h2>
              <p className="text-soft-grey leading-relaxed">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, TAILOR SHIFT SHALL NOT BE LIABLE FOR ANY
                INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT
                NOT LIMITED TO LOSS OF PROFITS, DATA, OR BUSINESS OPPORTUNITIES. OUR TOTAL
                LIABILITY FOR ANY CLAIMS ARISING FROM YOUR USE OF THE SERVICE SHALL NOT EXCEED
                THE AMOUNT YOU PAID TO US IN THE TWELVE MONTHS PRECEDING THE CLAIM.
              </p>
            </section>

            <section id="termination" className="mb-12">
              <h2 className="font-serif text-2xl text-charcoal mb-4">9. Termination</h2>
              <p className="text-soft-grey leading-relaxed mb-4">
                You may terminate your account at any time through your account settings or by
                contacting us. We may suspend or terminate your access to the Service at any time,
                with or without cause, with or without notice.
              </p>
              <p className="text-soft-grey leading-relaxed">
                Upon termination, your right to use the Service will immediately cease. Provisions
                of these Terms that by their nature should survive termination shall survive,
                including intellectual property provisions, disclaimers, and limitations of liability.
              </p>
            </section>

            <section id="changes" className="mb-12">
              <h2 className="font-serif text-2xl text-charcoal mb-4">10. Changes to Terms</h2>
              <p className="text-soft-grey leading-relaxed">
                We may modify these Terms at any time. We will notify you of material changes by
                posting the updated Terms on the Service and updating the &quot;Last updated&quot; date.
                Your continued use of the Service after changes become effective constitutes
                acceptance of the modified Terms.
              </p>
            </section>

            <section id="contact" className="mb-12">
              <h2 className="font-serif text-2xl text-charcoal mb-4">11. Contact Information</h2>
              <p className="text-soft-grey leading-relaxed">
                If you have questions about these Terms, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-off-white rounded-lg">
                <p className="text-charcoal">
                  <strong>Tailor Shift</strong>
                </p>
                <p className="text-soft-grey">Email: legal@tailorshift.com</p>
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
                className="text-caption text-charcoal font-medium"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="text-caption text-soft-grey hover:text-charcoal"
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
