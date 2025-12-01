import Link from 'next/link'

export default function ProfessionalsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-concrete">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="font-serif text-xl text-charcoal">
            Tailor Shift
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/brands" className="text-caption text-soft-grey hover:text-charcoal">
              For Brands
            </Link>
            <Link
              href="/login"
              className="text-caption text-charcoal hover:text-matte-gold"
            >
              Sign In
            </Link>
            <Link
              href="/signup?type=talent"
              className="px-4 py-2 bg-matte-gold text-charcoal rounded text-caption font-medium hover:bg-matte-gold/90"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-caption uppercase tracking-widest text-matte-gold mb-4">
            For Retail Professionals
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal leading-tight">
            Your Luxury Career,{' '}
            <span className="text-matte-gold">Intelligently Matched</span>
          </h1>
          <p className="mt-6 text-xl text-soft-grey max-w-2xl mx-auto">
            Discover opportunities at the world&apos;s most prestigious maisons. Let our
            intelligent matching engine find roles that align with your expertise,
            aspirations, and lifestyle.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup?type=talent"
              className="inline-flex h-12 items-center justify-center px-8 bg-matte-gold text-charcoal rounded font-medium hover:bg-matte-gold/90"
            >
              Create Your Profile
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex h-12 items-center justify-center px-8 border border-charcoal text-charcoal rounded font-medium hover:bg-charcoal/5"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-20 px-6 bg-off-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="font-serif text-3xl text-charcoal text-center mb-16">
            Why Professionals Choose Tailor Shift
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg border border-concrete">
              <div className="w-12 h-12 bg-matte-gold/10 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-sans text-lg font-semibold text-charcoal mb-3">
                Perfect Match, Every Time
              </h3>
              <p className="text-soft-grey">
                Our 7-dimension matching algorithm considers your experience, preferences,
                and career goals to surface only the most relevant opportunities.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg border border-concrete">
              <div className="w-12 h-12 bg-matte-gold/10 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="font-sans text-lg font-semibold text-charcoal mb-3">
                Complete Confidentiality
              </h3>
              <p className="text-soft-grey">
                Your profile and career journey remain private. You control what brands
                see and when. No one knows you&apos;re exploring unless you want them to.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg border border-concrete">
              <div className="w-12 h-12 bg-matte-gold/10 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="font-sans text-lg font-semibold text-charcoal mb-3">
                Career Growth Insights
              </h3>
              <p className="text-soft-grey">
                Get personalized career projections, identify skill gaps, and access
                learning recommendations to accelerate your path to leadership.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-serif text-3xl text-charcoal text-center mb-16">
            How It Works
          </h2>

          <div className="space-y-12">
            <div className="flex gap-6 items-start">
              <div className="w-10 h-10 bg-matte-gold rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold">1</span>
              </div>
              <div>
                <h3 className="font-sans text-lg font-semibold text-charcoal mb-2">
                  Create Your Profile
                </h3>
                <p className="text-soft-grey">
                  Tell us about your experience, expertise across luxury divisions, and
                  career aspirations. Our guided onboarding takes just 10 minutes.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-10 h-10 bg-matte-gold rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold">2</span>
              </div>
              <div>
                <h3 className="font-sans text-lg font-semibold text-charcoal mb-2">
                  Complete the Retail Excellence Scan
                </h3>
                <p className="text-soft-grey">
                  Our 15-minute assessment evaluates your capabilities across service
                  excellence, clienteling, operations, and leadership. No right or wrong
                  answers—just honest insights.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-10 h-10 bg-matte-gold rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold">3</span>
              </div>
              <div>
                <h3 className="font-sans text-lg font-semibold text-charcoal mb-2">
                  Receive Intelligent Matches
                </h3>
                <p className="text-soft-grey">
                  Our engine analyzes your profile against active opportunities from
                  luxury brands. You&apos;ll see match scores with clear explanations of why
                  each role fits you.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-10 h-10 bg-matte-gold rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold">4</span>
              </div>
              <div>
                <h3 className="font-sans text-lg font-semibold text-charcoal mb-2">
                  Express Interest & Connect
                </h3>
                <p className="text-soft-grey">
                  When a role excites you, express interest. When brands are equally
                  interested, we facilitate the connection. You stay in control throughout.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Assessment Preview */}
      <section className="py-20 px-6 bg-off-white">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-caption uppercase tracking-widest text-matte-gold mb-4">
                Retail Excellence Scan
              </p>
              <h2 className="font-serif text-3xl text-charcoal mb-6">
                Understand Your Strengths
              </h2>
              <p className="text-soft-grey mb-6">
                Our proprietary assessment, developed with insights from leading luxury
                maisons, evaluates your capabilities across four key dimensions:
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-matte-gold rounded-full mt-2" />
                  <div>
                    <span className="font-medium text-charcoal">Service Excellence</span>
                    <p className="text-sm text-soft-grey">
                      Client experience delivery and luxury standards
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-matte-gold rounded-full mt-2" />
                  <div>
                    <span className="font-medium text-charcoal">Clienteling</span>
                    <p className="text-sm text-soft-grey">
                      Relationship building and VIC management
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-matte-gold rounded-full mt-2" />
                  <div>
                    <span className="font-medium text-charcoal">Operations</span>
                    <p className="text-sm text-soft-grey">
                      Process efficiency and inventory mastery
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-matte-gold rounded-full mt-2" />
                  <div>
                    <span className="font-medium text-charcoal">Leadership Signals</span>
                    <p className="text-sm text-soft-grey">
                      Team influence and strategic thinking
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-lg border border-concrete">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-charcoal">Service Excellence</span>
                    <span className="text-matte-gold">82%</span>
                  </div>
                  <div className="h-2 bg-concrete rounded-full">
                    <div className="h-2 bg-matte-gold rounded-full" style={{ width: '82%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-charcoal">Clienteling</span>
                    <span className="text-matte-gold">75%</span>
                  </div>
                  <div className="h-2 bg-concrete rounded-full">
                    <div className="h-2 bg-matte-gold rounded-full" style={{ width: '75%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-charcoal">Operations</span>
                    <span className="text-matte-gold">68%</span>
                  </div>
                  <div className="h-2 bg-concrete rounded-full">
                    <div className="h-2 bg-matte-gold rounded-full" style={{ width: '68%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-charcoal">Leadership Signals</span>
                    <span className="text-matte-gold">71%</span>
                  </div>
                  <div className="h-2 bg-concrete rounded-full">
                    <div className="h-2 bg-matte-gold rounded-full" style={{ width: '71%' }} />
                  </div>
                </div>
              </div>
              <p className="text-xs text-soft-grey text-center mt-6">
                Sample assessment results visualization
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-charcoal">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-3xl text-white mb-6">
            Ready to Elevate Your Career?
          </h2>
          <p className="text-lg text-white/70 mb-10">
            Join thousands of luxury retail professionals who have discovered their
            perfect next role through Tailor Shift.
          </p>
          <Link
            href="/signup?type=talent"
            className="inline-flex h-12 items-center justify-center px-8 bg-matte-gold text-charcoal rounded font-medium hover:bg-matte-gold/90"
          >
            Create Your Profile — It&apos;s Free
          </Link>
        </div>
      </section>

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
