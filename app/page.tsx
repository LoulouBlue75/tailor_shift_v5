import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { H1, H2, H3, Text } from '@/components/ui/Typography'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-ivory selection:bg-gold/20">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-ivory/95 backdrop-blur-sm border-b border-stone/20">
        <div className="container mx-auto h-20 flex justify-between items-center">
          <Link href="/" className="flex items-center group">
            <Image
              src="/brand/logo-monogram.png"
              alt="Tailor Shift"
              width={40}
              height={40}
              className="h-10 w-auto opacity-90 group-hover:opacity-100 transition-opacity duration-300"
              priority
            />
          </Link>
          
          <div className="hidden md:flex items-center gap-12">
            <Link
              href="/professionals"
              className="text-caption font-medium text-grey-warm hover:text-charcoal tracking-luxury-wide transition-colors duration-300"
            >
              For Professionals
            </Link>
            <Link
              href="/brands"
              className="text-caption font-medium text-grey-warm hover:text-charcoal tracking-luxury-wide transition-colors duration-300"
            >
              For Brands
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/login"
              className="text-caption font-medium text-charcoal hover:text-gold-dark tracking-luxury-wide transition-colors duration-300"
            >
              Sign In
            </Link>
            <Link href="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Text Content - Left (60%) */}
            <div className="lg:col-span-7 space-y-8">
              <H1 className="text-5xl md:text-6xl lg:text-7xl leading-[1.1]">
                Where exceptional retail talent meets <span className="text-gold-dark">prestigious</span> luxury maisons.
              </H1>
              
              <Text className="text-xl text-charcoal-soft max-w-2xl font-light leading-relaxed">
                The intelligent matching platform connecting top retail professionals with the world's finest brands.
              </Text>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/professionals">
                  <Button size="lg" className="w-full sm:w-auto min-w-[200px]">
                    I'm a Professional
                  </Button>
                </Link>
                <Link href="/brands">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto min-w-[200px]">
                    I'm a Brand
                  </Button>
                </Link>
              </div>
            </div>

            {/* Visual - Right (40%) */}
            <div className="lg:col-span-5 relative h-[600px] hidden lg:block">
              {/* Illustration anchored to top-right */}
              <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
                <Image
                  src="/brand/la_grasset_single_golden_thread_ascending_in_elegant_curve_on_87aa6836-f1f6-4aa4-9114-5b9b3dfaa8b2_1.png"
                  alt="Ascending golden thread"
                  fill
                  className="object-contain object-top-right"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Decorative background texture (CSS based or image) */}
        <div className="absolute inset-0 bg-[url('/brand/bg-ivory-paper.png')] opacity-40 mix-blend-multiply pointer-events-none" />
      </section>

      {/* Features Section */}
      <section className="py-spacious md:py-expansive bg-ivory-light relative">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <H2 className="mb-6">Refined connections for the luxury industry</H2>
            <Text className="text-grey-warm">
              Tailor Shift understands the nuance of high-end retail, prioritizing discretion, precision, and alignment.
            </Text>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="bg-ivory hover:shadow-hover transition-shadow duration-500 border-none">
              <div className="h-16 w-16 mb-8 flex items-center justify-center">
                 <Image
                  src="/brand/la_grasset_three_fine_golden_threads_converging_toward_center_60ffd8e6-60cf-4606-bf3d-c63ddcd4c386_0.png"
                  alt="Matching"
                  width={64}
                  height={64}
                  className="object-contain opacity-80"
                />
              </div>
              <H3 className="mb-4">Intelligent Matching</H3>
              <Text className="text-charcoal-soft">
                Our 7-dimension algorithm ensures perfect alignment between talent aspirations and brand opportunities.
              </Text>
            </Card>

            {/* Feature 2 */}
            <Card className="bg-ivory hover:shadow-hover transition-shadow duration-500 border-none">
              <div className="h-16 w-16 mb-8 flex items-center justify-center">
                <Image
                  src="/brand/la_grasset_needle_pulling_golden_thread_upward_through_ivory__e20fc15f-ae38-45b3-a0af-ff34a0a4e7d5_0.png"
                  alt="Expertise"
                  width={64}
                  height={64}
                  className="object-contain opacity-80"
                />
              </div>
              <H3 className="mb-4">Luxury Expertise</H3>
              <Text className="text-charcoal-soft">
                Built exclusively for luxury retail, understanding the unique dynamics of high-end boutique environments.
              </Text>
            </Card>

            {/* Feature 3 */}
            <Card className="bg-ivory hover:shadow-hover transition-shadow duration-500 border-none">
              <div className="h-16 w-16 mb-8 flex items-center justify-center">
                 <Image
                  src="/brand/la_grasset_single_small_golden_thread_curl_resting_on_vast_iv_cbc177a7-05a2-4b2d-a541-bdb2a43c7d4d_0.png"
                  alt="Privacy"
                  width={64}
                  height={64}
                  className="object-contain opacity-80"
                />
              </div>
              <H3 className="mb-4">Privacy First</H3>
              <Text className="text-charcoal-soft">
                Your career journey is confidential. We never share sensitive information without your explicit consent.
              </Text>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ivory py-spacious border-t border-stone/20">
        <div className="container flex flex-col items-center gap-8">
          <Link href="/" className="opacity-80 hover:opacity-100 transition-opacity duration-300">
            <Image
              src="/brand/logo-wordmark.png"
              alt="Tailor Shift"
              width={160}
              height={32}
              className="h-8 w-auto"
            />
          </Link>
          
          <div className="flex gap-8 text-caption text-grey-warm">
            <Link href="/terms" className="hover:text-charcoal transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-charcoal transition-colors">Privacy</Link>
            <Link href="/professionals" className="hover:text-charcoal transition-colors">Professionals</Link>
            <Link href="/brands" className="hover:text-charcoal transition-colors">Brands</Link>
          </div>

          <Text variant="caption" className="text-stone">
            © {new Date().getFullYear()} Tailor Shift. All rights reserved.
          </Text>
        </div>
      </footer>
    </main>
  )
}
