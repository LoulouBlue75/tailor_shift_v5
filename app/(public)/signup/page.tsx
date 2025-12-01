"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button, Input, Card, H2, H3, Text } from "@/components/ui";

type UserType = "talent" | "brand";

function SignupForm() {
  const searchParams = useSearchParams();
  const typeFromUrl = searchParams.get("type") as UserType | null;
  
  const [step, setStep] = useState<"select" | "form">(typeFromUrl ? "form" : "select");
  const [userType, setUserType] = useState<UserType | null>(typeFromUrl);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (typeFromUrl) {
      setUserType(typeFromUrl);
      setStep("form");
    }
  }, [typeFromUrl]);

  const handleSelectType = (type: UserType) => {
    setUserType(type);
    setStep("form");
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userType) return;
    
    setError(null);
    setLoading(true);

    const supabase = createClient();
    
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          user_type: userType,
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  const handleOAuthSignup = async (provider: "google" | "linkedin_oidc") => {
    if (!userType) return;
    
    setLoading(true);
    const supabase = createClient();
    
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?type=${userType}`,
      },
    });
  };

  // Success state
  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center p-comfortable bg-ivory">
        <Card className="max-w-md w-full p-10 text-center border-none shadow-elevated bg-ivory-light">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10 mb-6">
            <svg className="h-8 w-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <H2 className="text-3xl mb-4">Check Your Email</H2>
          <Text className="text-grey-warm leading-relaxed">
            We've sent a confirmation link to <strong className="text-charcoal font-medium">{email}</strong>. 
            Click the link to verify your account.
          </Text>
          <div className="mt-8">
            <Link href="/login">
              <Button variant="ghost">Back to login</Button>
            </Link>
          </div>
        </Card>
      </main>
    );
  }

  // Step 1: Select user type
  if (step === "select") {
    return (
      <main className="min-h-screen flex items-center justify-center p-comfortable bg-ivory">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-16">
            <Link href="/" className="inline-block mb-8 opacity-90 hover:opacity-100 transition-opacity">
              <Image
                src="/brand/logo-monogram.png"
                alt="Tailor Shift"
                width={56}
                height={56}
                className="h-14 w-auto"
                priority
              />
            </Link>
            <H2 className="text-4xl mb-4">Embark on your tailored journey</H2>
            <Text className="text-xl text-charcoal-soft font-light">
              Tell us who you are and we'll craft the right experience for you.
            </Text>
          </div>

          <div className="grid md:grid-cols-2 gap-10 max-w-3xl mx-auto">
            {/* Professional Option */}
            <Card 
              onClick={() => handleSelectType("talent")} 
              className="group p-10 border-none shadow-subtle hover:shadow-card transition-all duration-500 cursor-pointer bg-ivory-light relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.08] group-hover:opacity-[0.15] transition-opacity pointer-events-none">
                <Image
                  src="/brand/la_grasset_single_golden_thread_ascending_in_elegant_curve_on_87aa6836-f1f6-4aa4-9114-5b9b3dfaa8b2_1.png"
                  alt=""
                  fill
                  className="object-contain object-top-right"
                />
              </div>

              <div className="flex h-12 w-12 items-center justify-center mb-6 bg-gold/10 rounded-full group-hover:bg-gold/15 transition-colors">
                <svg className="w-5 h-5 text-gold-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <H3 className="mb-2 group-hover:text-gold-dark transition-colors">For Professionals</H3>
              <Text className="text-grey-warm mb-8 font-light">
                Advance your career in luxury retail.
              </Text>
              <Text className="text-caption text-charcoal-soft leading-relaxed">
                Build a polished profile <span className="text-gold mx-2">·</span> Discover curated opportunities <span className="text-gold mx-2">·</span> Track your growth
              </Text>
            </Card>

            {/* Brand Option */}
            <Card 
              onClick={() => handleSelectType("brand")} 
              className="group p-10 border-none shadow-subtle hover:shadow-card transition-all duration-500 cursor-pointer bg-ivory-light relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.08] group-hover:opacity-[0.15] transition-opacity pointer-events-none">
                <Image
                  src="/brand/la_grasset_tiny_golden_thread_forming_minimal_house_shape_sin_4c2e0c04-2e5b-4961-9503-949edd4c949a_0.png"
                  alt=""
                  fill
                  className="object-contain object-top-right"
                />
              </div>

              <div className="flex h-12 w-12 items-center justify-center mb-6 bg-gold/10 rounded-full group-hover:bg-gold/15 transition-colors">
                <svg className="w-5 h-5 text-gold-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <H3 className="mb-2 group-hover:text-gold-dark transition-colors">For Luxury Brands</H3>
              <Text className="text-grey-warm mb-8 font-light">
                Find exceptional talent for your maisons.
              </Text>
              <Text className="text-caption text-charcoal-soft leading-relaxed">
                Publish boutique opportunities <span className="text-gold mx-2">·</span> Connect with matched professionals <span className="text-gold mx-2">·</span> Manage your stores
              </Text>
            </Card>
          </div>

          <div className="mt-16 text-center">
            <Text variant="caption" className="text-grey-warm">
              Already have an account?{" "}
              <Link href="/login" className="text-charcoal font-medium hover:text-gold-dark transition-colors underline underline-offset-4">
                Sign in
              </Link>
            </Text>
          </div>
        </div>
      </main>
    );
  }

  // Step 2: Signup form
  return (
    <main className="min-h-screen flex items-center justify-center p-comfortable bg-ivory">
      <div className="w-full max-w-md">
        <Card className="p-10 border-none shadow-elevated bg-ivory-light">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-6 opacity-90 hover:opacity-100 transition-opacity">
              <Image
                src="/brand/logo-monogram.png"
                alt="Tailor Shift"
                width={56}
                height={56}
                className="h-14 w-auto"
                priority
              />
            </Link>
            <H2 className="text-3xl mb-2">Create Account</H2>
            <Text className="text-grey-warm">
              Join as a <span className="text-gold-dark font-medium">{userType === "brand" ? "Brand" : "Professional"}</span>
            </Text>
          </div>

          {/* Back button */}
          <button
            onClick={() => {
              setStep("select");
              setUserType(null);
            }}
            className="absolute top-8 left-8 text-grey-warm hover:text-charcoal transition-colors hidden sm:flex items-center gap-2 text-sm font-medium tracking-luxury-wide"
          >
            ← Back
          </button>

          {/* Signup Form */}
          <form onSubmit={handleSignup} className="space-y-6">
            {error && (
              <div className="rounded bg-error/10 p-4 text-sm text-error border border-error/20">
                {error}
              </div>
            )}

            <Input
              label="Full Name"
              name="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder={userType === "brand" ? "Your name" : "Your full name"}
              className="bg-white"
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@company.com"
              className="bg-white"
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Min. 8 characters"
              helperText="Must be at least 8 characters"
              className="bg-white"
            />

            <Button type="submit" loading={loading} className="w-full" size="lg">
              Create Account
            </Button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-stone/30" />
            <Text variant="caption" className="text-stone">or continue with</Text>
            <div className="h-px flex-1 bg-stone/30" />
          </div>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => handleOAuthSignup("google")}
              disabled={loading}
              className="bg-white"
            >
              <span className="mr-2">G</span> Google
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => handleOAuthSignup("linkedin_oidc")}
              disabled={loading}
              className="bg-white"
            >
              <span className="mr-2">in</span> LinkedIn
            </Button>
          </div>

          {/* Login link */}
          <div className="mt-8 text-center">
            <Text variant="caption">
              Already have an account?{" "}
              <Link href="/login" className="text-charcoal font-medium hover:text-gold-dark transition-colors underline underline-offset-4">
                Sign in
              </Link>
            </Text>
          </div>
        </Card>
      </div>
    </main>
  );
}

function SignupLoading() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-ivory">
      <div className="flex flex-col items-center">
        <div className="h-12 w-12 animate-pulse rounded-full bg-gold/20 mb-4" />
        <Text className="text-grey-warm">Loading...</Text>
      </div>
    </main>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<SignupLoading />}>
      <SignupForm />
    </Suspense>
  );
}
