import Link from 'next/link'

export default function BrandsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-concrete">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="font-serif text-xl text-charcoal">
            Tailor Shift
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/professionals" className="text-caption text-soft-grey hover:text-charcoal">
              For Professionals
            </Link>
            <Link
              href="/login"
              className="text-caption text-charcoal hover:text-matte-gold"
            >
              Sign In
            </Link>
            <Link
              href="/signup?type=brand"
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
            For Luxury Brands
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal leading-tight">
            Find Exceptional Talent,{' '}
            <span className="text-matte-gold">Effortlessly</span>
          </h1>
          <p className="mt-6 text-xl text-soft-grey max-w-2xl mx-auto">
            Access a curated pool of pre-vetted luxury retail professionals. Our
            intelligent matching ensures you see only candidates who truly fit your
            boutique culture and requirements.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup?type=brand"
              className="inline-flex h-12 items-center justify-center px-8 bg-matte-gold text-charcoal rounded font-medium hover:bg-matte-gold/90"
            >
              Start Hiring
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
            Why Brands Choose Tailor Shift
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg border border-concrete">
              <div className="w-12 h-12 bg-matte-gold/10 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="font-sans text-lg font-semibold text-charcoal mb-3">
                Pre-Vetted Quality
              </h3>
              <p className="text-soft-grey">
                Every professional on our platform has completed our Retail Excellence
                Scan. You see assessed capabilities before making contact.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg border border-concrete">
              <div className="w-12 h-12 bg-matte-gold/10 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-sans text-lg font-semibold text-charcoal mb-3">
                7-Dimension Matching
              </h3>
              <p className="text-soft-grey">
                Our algorithm considers role fit, division expertise, store complexity,
                capabilities, geography, experience, and preferences for precise matches.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg border border-concrete">
              <div className="w-12 h-12 bg-matte-gold/10 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-sans text-lg font-semibold text-charcoal mb-3">
                Reduce Time-to-Hire
              </h3>
              <p className="text-soft-grey">
                Post an opportunity and receive intelligent matches instantly. No more
                sifting through hundreds of unsuitable applications.
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
                  Set Up Your Brand Profile
                </h3>
                <p className="text-soft-grey">
                  Tell us about your maison, your stores, and the types of roles you
                  typically hire for. Our onboarding takes just 5 minutes.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-10 h-10 bg-matte-gold rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold">2</span>
              </div>
              <div>
                <h3 className="font-sans text-lg font-semibold text-charcoal mb-2">
                  Post Opportunities
                </h3>
                <p className="text-soft-grey">
                  Create role listings using our templates or from scratch. Define the
                  level, division, required experience, and capabilities you need.
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
                  Our engine instantly matches your opportunity against thousands of
                  qualified professionals. See match scores and detailed fit breakdowns.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-10 h-10 bg-matte-gold rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold">4</span>
              </div>
              <div>
                <h3 className="font-sans text-lg font-semibold text-charcoal mb-2">
                  Connect with Top Talent
                </h3>
                <p className="text-soft-grey">
                  Express interest in candidates who excite you. When there&apos;s mutual
                  interest, we facilitate the introduction. Simple and respectful.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Matching Preview */}
      <section className="py-20 px-6 bg-off-white">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-caption uppercase tracking-widest text-matte-gold mb-4">
                7-Dimension Matching
              </p>
              <h2 className="font-serif text-3xl text-charcoal mb-6">
                See Beyond the CV
              </h2>
              <p className="text-soft-grey mb-6">
                Our matching algorithm evaluates candidates across seven dimensions,
                giving you a complete picture of fit:
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-matte-gold rounded-full mt-2" />
                  <div>
                    <span className="font-medium text-charcoal">Role Fit</span>
                    <p className="text-sm text-soft-grey">
                      Experience level alignment with your requirements
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-matte-gold rounded-full mt-2" />
                  <div>
                    <span className="font-medium text-charcoal">Division Expertise</span>
                    <p className="text-sm text-soft-grey">
                      Relevant category experience (fashion, beauty, jewelry, etc.)
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-matte-gold rounded-full mt-2" />
                  <div>
                    <span className="font-medium text-charcoal">Store Context</span>
                    <p className="text-sm text-soft-grey">
                      Experience with similar store complexity tiers
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-matte-gold rounded-full mt-2" />
                  <div>
                    <span className="font-medium text-charcoal">Capability Fit</span>
                    <p className="text-sm text-soft-grey">
                      Assessment scores vs. your required capabilities
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-lg border border-concrete">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="font-semibold text-charcoal">Alexandra M.</p>
                  <p className="text-sm text-soft-grey">Senior Advisor • Fashion</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-matte-gold">87%</p>
                  <p className="text-xs text-soft-grey">Match Score</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-soft-grey">Role Fit</span>
                    <span className="text-charcoal">95%</span>
                  </div>
                  <div className="h-1.5 bg-concrete rounded-full">
                    <div className="h-1.5 bg-matte-gold rounded-full" style={{ width: '95%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-soft-grey">Division Fit</span>
                    <span className="text-charcoal">100%</span>
                  </div>
                  <div className="h-1.5 bg-concrete rounded-full">
                    <div className="h-1.5 bg-matte-gold rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-soft-grey">Store Context</span>
                    <span className="text-charcoal">85%</span>
                  </div>
                  <div className="h-1.5 bg-concrete rounded-full">
                    <div className="h-1.5 bg-matte-gold rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-soft-grey">Capability Fit</span>
                    <span className="text-charcoal">78%</span>
                  </div>
                  <div className="h-1.5 bg-concrete rounded-full">
                    <div className="h-1.5 bg-matte-gold rounded-full" style={{ width: '78%' }} />
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-concrete">
                <p className="text-xs text-soft-grey">
                  <span className="inline-block px-2 py-1 bg-green-50 text-green-700 rounded mr-2">
                    Within Range
                  </span>
                  Compensation aligned
                </p>
              </div>
              <p className="text-xs text-soft-grey text-center mt-6">
                Sample match card visualization
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Talent Pool Quality */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-serif text-3xl text-charcoal mb-16">
            A Curated Talent Pool
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <p className="text-4xl font-bold text-matte-gold mb-2">L1-L8</p>
              <p className="text-sm text-soft-grey">Role Levels Covered</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-matte-gold mb-2">9</p>
              <p className="text-sm text-soft-grey">Luxury Divisions</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-matte-gold mb-2">T1-T5</p>
              <p className="text-sm text-soft-grey">Store Complexity Tiers</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-matte-gold mb-2">Global</p>
              <p className="text-sm text-soft-grey">Talent Coverage</p>
            </div>
          </div>

          <p className="mt-12 text-soft-grey max-w-2xl mx-auto">
            From Sales Advisors to Regional Directors, across fashion, leather goods,
            beauty, watches, jewelry, and more—find professionals who understand luxury
            retail at every level.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-charcoal">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-3xl text-white mb-6">
            Ready to Transform Your Hiring?
          </h2>
          <p className="text-lg text-white/70 mb-10">
            Join prestigious maisons who trust Tailor Shift to find their next
            exceptional team members.
          </p>
          <Link
            href="/signup?type=brand"
            className="inline-flex h-12 items-center justify-center px-8 bg-matte-gold text-charcoal rounded font-medium hover:bg-matte-gold/90"
          >
            Start Hiring Today
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
