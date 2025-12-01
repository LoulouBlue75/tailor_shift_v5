import Link from 'next/link'
import Image from 'next/image'

export default function BrandsPage() {
  return (
    <main className="min-h-screen bg-ivory">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-ivory-light/95 backdrop-blur-sm shadow-subtle">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/brand/logo-monogram.png"
              alt="Tailor Shift"
              width={40}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>
          <div className="flex items-center gap-6">
            <Link 
              href="/professionals" 
              className="text-caption text-grey-warm hover:text-gold tracking-luxury-wide transition-all duration-300"
            >
              For Professionals
            </Link>
            <Link
              href="/login"
              className="text-caption text-charcoal hover:text-gold tracking-luxury-wide transition-all duration-300"
            >
              Sign In
            </Link>
            <Link
              href="/signup?type=brand"
              className="px-5 py-2.5 bg-gold text-charcoal rounded-lg text-caption font-medium tracking-luxury-wide hover:bg-gold-copper shadow-subtle hover:shadow-card transition-all duration-300"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-label uppercase tracking-luxury-wider text-gold mb-4">
            For Luxury Brands
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal leading-tight">
            Find Exceptional Talent,{' '}
            <span className="text-gold">Effortlessly</span>
          </h1>
          <p className="mt-6 text-xl text-grey-warm max-w-2xl mx-auto">
            Access a curated pool of pre-vetted luxury retail professionals. Our
            intelligent matching ensures you see only candidates who truly fit your
            boutique culture and requirements.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup?type=brand"
              className="inline-flex h-12 items-center justify-center px-8 bg-gold text-charcoal rounded-lg font-medium tracking-luxury-wide hover:bg-gold-copper shadow-subtle hover:shadow-card transition-all duration-300"
            >
              Start Hiring
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex h-12 items-center justify-center px-8 border border-stone text-charcoal rounded-lg font-medium tracking-luxury-wide hover:border-gold hover:text-gold-dark transition-all duration-300"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-20 px-6 bg-ivory-light relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <div className="container mx-auto max-w-6xl">
          <h2 className="font-serif text-3xl text-charcoal text-center mb-16">
            Why Brands Choose Tailor Shift
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-ivory-light p-8 rounded-lg shadow-card">
              <div className="w-16 h-16 flex items-center justify-center mb-6">
                <Image
                  src="/brand/la_grasset_needle_pulling_golden_thread_upward_through_ivory__e20fc15f-ae38-45b3-a0af-ff34a0a4e7d5_0.png"
                  alt="Pre-Vetted Quality"
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
              <h3 className="font-sans text-lg font-semibold text-charcoal mb-3">
                Pre-Vetted Quality
              </h3>
              <p className="text-grey-warm">
                Every professional on our platform has completed our Retail Excellence
                Scan. You see assessed capabilities before making contact.
              </p>
            </div>

            <div className="bg-ivory-light p-8 rounded-lg shadow-card">
              <div className="w-16 h-16 flex items-center justify-center mb-6">
                <Image
                  src="/brand/la_grasset_three_fine_golden_threads_converging_toward_center_60ffd8e6-60cf-4606-bf3d-c63ddcd4c386_0.png"
                  alt="7-Dimension Matching"
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
              <h3 className="font-sans text-lg font-semibold text-charcoal mb-3">
                7-Dimension Matching
              </h3>
              <p className="text-grey-warm">
                Our algorithm considers role fit, division expertise, store complexity,
                capabilities, geography, experience, and preferences for precise matches.
              </p>
            </div>

            <div className="bg-ivory-light p-8 rounded-lg shadow-card">
              <div className="w-16 h-16 flex items-center justify-center mb-6">
                <Image
                  src="/brand/la_grasset_two_golden_threads_approaching_each_other_across_t_8a1580c1-d812-4645-a3ab-977e47f505c6_0.png"
                  alt="Reduce Time-to-Hire"
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
              <h3 className="font-sans text-lg font-semibold text-charcoal mb-3">
                Reduce Time-to-Hire
              </h3>
              <p className="text-grey-warm">
                Post an opportunity and receive intelligent matches instantly. No more
                sifting through hundreds of unsuitable applications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-ivory">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-serif text-3xl text-charcoal text-center mb-16">
            How It Works
          </h2>

          <div className="space-y-12">
            <div className="flex gap-6 items-start">
              <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-charcoal font-semibold">1</span>
              </div>
              <div>
                <h3 className="font-sans text-lg font-semibold text-charcoal mb-2">
                  Set Up Your Brand Profile
                </h3>
                <p className="text-grey-warm">
                  Tell us about your maison, your stores, and the types of roles you
                  typically hire for. Our onboarding takes just 5 minutes.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-charcoal font-semibold">2</span>
              </div>
              <div>
                <h3 className="font-sans text-lg font-semibold text-charcoal mb-2">
                  Post Opportunities
                </h3>
                <p className="text-grey-warm">
                  Create role listings using our templates or from scratch. Define the
                  level, division, required experience, and capabilities you need.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-charcoal font-semibold">3</span>
              </div>
              <div>
                <h3 className="font-sans text-lg font-semibold text-charcoal mb-2">
                  Receive Intelligent Matches
                </h3>
                <p className="text-grey-warm">
                  Our engine instantly matches your opportunity against thousands of
                  qualified professionals. See match scores and detailed fit breakdowns.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-charcoal font-semibold">4</span>
              </div>
              <div>
                <h3 className="font-sans text-lg font-semibold text-charcoal mb-2">
                  Connect with Top Talent
                </h3>
                <p className="text-grey-warm">
                  Express interest in candidates who excite you. When there&apos;s mutual
                  interest, we facilitate the introduction. Simple and respectful.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Matching Preview */}
      <section className="py-20 px-6 bg-ivory-light relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-label uppercase tracking-luxury-wider text-gold mb-4">
                7-Dimension Matching
              </p>
              <h2 className="font-serif text-3xl text-charcoal mb-6">
                See Beyond the CV
              </h2>
              <p className="text-grey-warm mb-6">
                Our matching algorithm evaluates candidates across seven dimensions,
                giving you a complete picture of fit:
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gold rounded-full mt-2" />
                  <div>
                    <span className="font-medium text-charcoal">Role Fit</span>
                    <p className="text-sm text-grey-warm">
                      Experience level alignment with your requirements
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gold rounded-full mt-2" />
                  <div>
                    <span className="font-medium text-charcoal">Division Expertise</span>
                    <p className="text-sm text-grey-warm">
                      Relevant category experience (fashion, beauty, jewelry, etc.)
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gold rounded-full mt-2" />
                  <div>
                    <span className="font-medium text-charcoal">Store Context</span>
                    <p className="text-sm text-grey-warm">
                      Experience with similar store complexity tiers
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gold rounded-full mt-2" />
                  <div>
                    <span className="font-medium text-charcoal">Capability Fit</span>
                    <p className="text-sm text-grey-warm">
                      Assessment scores vs. your required capabilities
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-ivory-light p-8 rounded-lg shadow-card">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="font-semibold text-charcoal">Alexandra M.</p>
                  <p className="text-sm text-grey-warm">Senior Advisor • Fashion</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gold">87%</p>
                  <p className="text-xs text-grey-warm">Match Score</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-grey-warm">Role Fit</span>
                    <span className="text-charcoal">95%</span>
                  </div>
                  <div className="h-1.5 bg-stone rounded-full">
                    <div className="h-1.5 bg-gold rounded-full" style={{ width: '95%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-grey-warm">Division Fit</span>
                    <span className="text-charcoal">100%</span>
                  </div>
                  <div className="h-1.5 bg-stone rounded-full">
                    <div className="h-1.5 bg-gold rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-grey-warm">Store Context</span>
                    <span className="text-charcoal">85%</span>
                  </div>
                  <div className="h-1.5 bg-stone rounded-full">
                    <div className="h-1.5 bg-gold rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-grey-warm">Capability Fit</span>
                    <span className="text-charcoal">78%</span>
                  </div>
                  <div className="h-1.5 bg-stone rounded-full">
                    <div className="h-1.5 bg-gold rounded-full" style={{ width: '78%' }} />
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-stone">
                <p className="text-xs text-grey-warm">
                  <span className="inline-block px-2 py-1 bg-success/15 text-[#5A6B4E] rounded mr-2">
                    Within Range
                  </span>
                  Compensation aligned
                </p>
              </div>
              <p className="text-xs text-grey-warm text-center mt-6">
                Sample match card visualization
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Talent Pool Quality */}
      <section className="py-20 px-6 bg-ivory">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-serif text-3xl text-charcoal mb-16">
            A Curated Talent Pool
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <p className="text-4xl font-bold text-gold mb-2">L1-L8</p>
              <p className="text-sm text-grey-warm">Role Levels Covered</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-gold mb-2">9</p>
              <p className="text-sm text-grey-warm">Luxury Divisions</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-gold mb-2">T1-T5</p>
              <p className="text-sm text-grey-warm">Store Complexity Tiers</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-gold mb-2">Global</p>
              <p className="text-sm text-grey-warm">Talent Coverage</p>
            </div>
          </div>

          <p className="mt-12 text-grey-warm max-w-2xl mx-auto">
            From Sales Advisors to Regional Directors, across fashion, leather goods,
            beauty, watches, jewelry, and more—find professionals who understand luxury
            retail at every level.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-charcoal relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-3xl text-ivory mb-6">
            Ready to Transform Your Hiring?
          </h2>
          <p className="text-lg text-ivory/70 mb-10">
            Join prestigious maisons who trust Tailor Shift to find their next
            exceptional team members.
          </p>
          <Link
            href="/signup?type=brand"
            className="inline-flex h-12 items-center justify-center px-8 bg-gold text-charcoal rounded-lg font-medium tracking-luxury-wide hover:bg-gold-copper transition-all duration-300"
          >
            Start Hiring Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ivory px-6 py-12 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-stone to-transparent" />
        <div className="container mx-auto">
          <div className="flex flex-col items-center gap-6">
            <Link href="/" className="opacity-60 hover:opacity-100 transition-opacity duration-300">
              <Image
                src="/brand/logo-wordmark.png"
                alt="Tailor Shift"
                width={120}
                height={30}
                className="h-6 w-auto"
              />
            </Link>
            <div className="flex gap-6">
              <Link
                href="/terms"
                className="text-caption text-grey-warm hover:text-charcoal tracking-luxury-wide transition-all duration-300"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="text-caption text-grey-warm hover:text-charcoal tracking-luxury-wide transition-all duration-300"
              >
                Privacy
              </Link>
            </div>
            <p className="text-caption text-grey-warm">
              © {new Date().getFullYear()} Tailor Shift. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
