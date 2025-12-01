import Link from 'next/link'
import Image from 'next/image'
import { Button, Card, H1, H2, H3, Text } from '@/components/ui'

export default function ProfessionalsPage() {
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
          <div className="flex items-center gap-6">
            <Link 
              href="/brands" 
              className="text-caption font-medium text-grey-warm hover:text-charcoal tracking-luxury-wide transition-colors duration-300"
            >
              For Brands
            </Link>
            <Link
              href="/login"
              className="text-caption font-medium text-charcoal hover:text-gold-dark tracking-luxury-wide transition-colors duration-300"
            >
              Sign In
            </Link>
            <Link href="/signup?type=talent">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 p-comfortable relative overflow-hidden">
        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <Text variant="label" className="text-gold mb-6 block">
            For Retail Professionals
          </Text>
          <H1 className="text-5xl md:text-6xl lg:text-7xl mb-8">
            Your Luxury Career,{' '}
            <span className="text-gold-dark italic">Intelligently Matched</span>
          </H1>
          <Text className="text-xl text-charcoal-soft max-w-2xl mx-auto font-light leading-relaxed mb-12">
            Discover opportunities at the world's most prestigious maisons. Let our
            intelligent matching engine find roles that align with your expertise,
            aspirations, and lifestyle.
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup?type=talent">
              <Button size="lg" className="min-w-[200px]">
                Create Your Profile
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button variant="secondary" size="lg" className="min-w-[200px]">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Subtle background decoration */}
        <div className="absolute top-1/2 left-0 w-64 h-64 opacity-10 pointer-events-none -translate-y-1/2">
           <Image
            src="/brand/la_grasset_subtle_golden_thread_traces_on_ivory_textured_surf_49edf17d-9ac9-42f0-8d56-e86a46c27ea7_1.png"
            alt=""
            fill
            className="object-contain object-left"
          />
        </div>
      </section>

      {/* Value Props */}
      <section className="py-spacious bg-ivory-light relative">
        <div className="container mx-auto max-w-6xl">
          <H2 className="text-center mb-16">Why Professionals Choose Tailor Shift</H2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-none hover:shadow-hover transition-all duration-500">
              <div className="w-16 h-16 flex items-center justify-center mb-8">
                <Image
                  src="/brand/la_grasset_three_fine_golden_threads_converging_toward_center_60ffd8e6-60cf-4606-bf3d-c63ddcd4c386_0.png"
                  alt="Perfect Match"
                  width={64}
                  height={64}
                  className="object-contain opacity-80"
                />
              </div>
              <H3 className="mb-4">Perfect Match, Every Time</H3>
              <Text className="text-charcoal-soft">
                Our 7-dimension matching algorithm considers your experience, preferences,
                and career goals to surface only the most relevant opportunities.
              </Text>
            </Card>

            <Card className="border-none hover:shadow-hover transition-all duration-500">
              <div className="w-16 h-16 flex items-center justify-center mb-8">
                <Image
                  src="/brand/la_grasset_single_small_golden_thread_curl_resting_on_vast_iv_cbc177a7-05a2-4b2d-a541-bdb2a43c7d4d_0.png"
                  alt="Confidentiality"
                  width={64}
                  height={64}
                  className="object-contain opacity-80"
                />
              </div>
              <H3 className="mb-4">Complete Confidentiality</H3>
              <Text className="text-charcoal-soft">
                Your profile and career journey remain private. You control what brands
                see and when. No one knows you're exploring unless you want them to.
              </Text>
            </Card>

            <Card className="border-none hover:shadow-hover transition-all duration-500">
              <div className="w-16 h-16 flex items-center justify-center mb-8">
                <Image
                  src="/brand/la_grasset_golden_thread_forming_ascending_steps_pattern_abst_65dc05d8-f1b8-4094-bd88-dd7ae49a2ae4_0.png"
                  alt="Career Growth"
                  width={64}
                  height={64}
                  className="object-contain opacity-80"
                />
              </div>
              <H3 className="mb-4">Career Growth Insights</H3>
              <Text className="text-charcoal-soft">
                Get personalized career projections, identify skill gaps, and access
                learning recommendations to accelerate your path to leadership.
              </Text>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-spacious bg-ivory">
        <div className="container mx-auto max-w-4xl">
          <H2 className="text-center mb-16">How It Works</H2>

          <div className="space-y-12">
            {[
              {
                step: 1,
                title: "Create Your Profile",
                desc: "Tell us about your experience, expertise across luxury divisions, and career aspirations. Our guided onboarding takes just 10 minutes."
              },
              {
                step: 2,
                title: "Complete the Retail Excellence Scan",
                desc: "Our 15-minute assessment evaluates your capabilities across service excellence, clienteling, operations, and leadership."
              },
              {
                step: 3,
                title: "Receive Intelligent Matches",
                desc: "Our engine analyzes your profile against active opportunities from luxury brands. You'll see match scores with clear explanations."
              },
              {
                step: 4,
                title: "Express Interest & Connect",
                desc: "When a role excites you, express interest. When brands are equally interested, we facilitate the connection."
              }
            ].map((item) => (
              <div key={item.step} className="flex gap-8 items-start group">
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-gold/20 transition-colors">
                  <span className="text-gold-dark font-serif text-xl">{item.step}</span>
                </div>
                <div>
                  <H3 className="mb-2">{item.title}</H3>
                  <Text className="text-grey-warm max-w-2xl">{item.desc}</Text>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-spacious bg-charcoal text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/brand/bg-ivory-paper.png')] opacity-5 mix-blend-overlay pointer-events-none" />
        <div className="container mx-auto max-w-3xl relative z-10">
          <H2 className="text-ivory mb-6">Ready to Elevate Your Career?</H2>
          <Text className="text-ivory/70 text-lg mb-10">
            Join thousands of luxury retail professionals who have discovered their
            perfect next role through Tailor Shift.
          </Text>
          <Link href="/signup?type=talent">
            <Button size="lg" className="bg-gold text-charcoal hover:bg-gold-light border-none">
              Create Your Profile — It's Free
            </Button>
          </Link>
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
            <Link href="/brands" className="hover:text-charcoal transition-colors">For Brands</Link>
          </div>

          <Text variant="caption" className="text-stone">
            © {new Date().getFullYear()} Tailor Shift. All rights reserved.
          </Text>
        </div>
      </footer>
    </main>
  )
}
