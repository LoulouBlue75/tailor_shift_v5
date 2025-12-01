import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-concrete">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="font-serif text-xl text-charcoal">
            Tailor Shift
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/professionals"
              className="text-caption text-soft-grey hover:text-charcoal transition-colors"
            >
              For Professionals
            </Link>
            <Link
              href="/brands"
              className="text-caption text-soft-grey hover:text-charcoal transition-colors"
            >
              For Brands
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-caption text-charcoal hover:text-matte-gold transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-matte-gold text-charcoal rounded text-caption font-medium hover:bg-matte-gold/90 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-comfortable pt-20 pb-16">
        <div className="container text-center">
          {/* Logo/Brand */}
          <h1 className="font-serif text-h1 tracking-tight text-charcoal md:text-5xl lg:text-6xl">
            Tailor Shift
          </h1>

          {/* Tagline */}
          <p className="mx-auto mt-6 max-w-2xl text-xl text-soft-grey md:text-2xl">
            Where exceptional retail talent meets prestigious luxury maisons
          </p>

          {/* Value Proposition */}
          <p className="mx-auto mt-4 max-w-xl text-body text-soft-grey">
            The intelligent matching platform connecting top retail professionals with the
            world&apos;s finest luxury brands.
          </p>

          {/* CTA Buttons */}
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/professionals"
              className="inline-flex h-12 min-w-[200px] items-center justify-center rounded bg-matte-gold px-8 font-sans font-medium text-charcoal transition-colors hover:bg-matte-gold/90"
            >
              I&apos;m a Professional
            </Link>
            <Link
              href="/brands"
              className="inline-flex h-12 min-w-[200px] items-center justify-center rounded border border-charcoal bg-transparent px-8 font-sans font-medium text-charcoal transition-colors hover:bg-charcoal/5"
            >
              I&apos;m a Brand
            </Link>
          </div>

          {/* Login Link */}
          <p className="mt-8 text-caption text-soft-grey">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-charcoal underline underline-offset-4 transition-colors hover:text-matte-gold"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="h-8 w-px bg-concrete" />
        </div>
      </section>

      {/* Features Section - Preview */}
      <section className="border-t border-concrete bg-white px-comfortable py-expansive">
        <div className="container">
          <h2 className="text-center font-serif text-h2 text-charcoal">Why Tailor Shift?</h2>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-matte-gold/10">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="mt-6 font-sans text-h3 text-charcoal">Intelligent Matching</h3>
              <p className="mt-3 text-body text-soft-grey">
                Our 7-dimension algorithm ensures perfect alignment between talent aspirations and
                brand opportunities.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-matte-gold/10">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="mt-6 font-sans text-h3 text-charcoal">Luxury Expertise</h3>
              <p className="mt-3 text-body text-soft-grey">
                Built exclusively for luxury retail, understanding the unique dynamics of high-end
                boutique environments.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-matte-gold/10">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="mt-6 font-sans text-h3 text-charcoal">Privacy First</h3>
              <p className="mt-3 text-body text-soft-grey">
                Your career journey is confidential. We never share sensitive information without
                your explicit consent.
              </p>
            </div>
          </div>

          {/* Learn More Links */}
          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/professionals"
              className="text-center text-matte-gold hover:underline underline-offset-4"
            >
              Learn more for Professionals →
            </Link>
            <Link
              href="/brands"
              className="text-center text-matte-gold hover:underline underline-offset-4"
            >
              Learn more for Brands →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-concrete bg-off-white px-comfortable py-spacious">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
              <Link href="/" className="font-serif text-lg text-charcoal">
                Tailor Shift
              </Link>
              <div className="flex gap-6">
                <Link
                  href="/professionals"
                  className="text-caption text-soft-grey transition-colors hover:text-charcoal"
                >
                  For Professionals
                </Link>
                <Link
                  href="/brands"
                  className="text-caption text-soft-grey transition-colors hover:text-charcoal"
                >
                  For Brands
                </Link>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
              <p className="text-caption text-soft-grey">
                © {new Date().getFullYear()} Tailor Shift. All rights reserved.
              </p>
              <div className="flex gap-6">
                <Link
                  href="/terms"
                  className="text-caption text-soft-grey transition-colors hover:text-charcoal"
                >
                  Terms
                </Link>
                <Link
                  href="/privacy"
                  className="text-caption text-soft-grey transition-colors hover:text-charcoal"
                >
                  Privacy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
