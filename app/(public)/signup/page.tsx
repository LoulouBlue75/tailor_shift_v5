"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button, Input, Card, H2, H3, Text, Stack, Grid } from "@/components/ui";

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
      <main className="flex min-h-screen items-center justify-center px-comfortable py-expansive">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
            <svg className="h-8 w-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <H2 className="mt-6">Check Your Email</H2>
          <Text className="mt-4 text-soft-grey">
            We&apos;ve sent a confirmation link to <strong className="text-charcoal">{email}</strong>. 
            Click the link to verify your account.
          </Text>
          <Link
            href="/login"
            className="mt-8 inline-block text-caption text-charcoal underline underline-offset-4 hover:text-matte-gold"
          >
            Back to login
          </Link>
        </div>
      </main>
    );
  }

  // Step 1: Select user type
  if (step === "select") {
    return (
      <main className="flex min-h-screen items-center justify-center px-comfortable py-expansive">
        <div className="w-full max-w-lg">
          <div className="text-center">
            <Link href="/" className="inline-block">
              <H2>Tailor Shift</H2>
            </Link>
            <Text className="mt-2 text-soft-grey">
              How would you like to use Tailor Shift?
            </Text>
          </div>

          <Grid cols={2} gap="md" className="mt-12">
            {/* Professional Option */}
            <Card variant="interactive" onClick={() => handleSelectType("talent")} className="p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-matte-gold/10">
                <span className="text-2xl">👤</span>
              </div>
              <H3 className="mt-6">I&apos;m a Professional</H3>
              <Text variant="caption" className="mt-2">
                Looking for your next opportunity in luxury retail
              </Text>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center gap-2 text-caption text-soft-grey">
                  <span className="text-matte-gold">✓</span> Create your profile
                </li>
                <li className="flex items-center gap-2 text-caption text-soft-grey">
                  <span className="text-matte-gold">✓</span> Get matched with opportunities
                </li>
                <li className="flex items-center gap-2 text-caption text-soft-grey">
                  <span className="text-matte-gold">✓</span> Track your career growth
                </li>
              </ul>
            </Card>

            {/* Brand Option */}
            <Card variant="interactive" onClick={() => handleSelectType("brand")} className="p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-matte-gold/10">
                <span className="text-2xl">🏢</span>
              </div>
              <H3 className="mt-6">I&apos;m a Brand</H3>
              <Text variant="caption" className="mt-2">
                Looking for exceptional talent for your boutiques
              </Text>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center gap-2 text-caption text-soft-grey">
                  <span className="text-matte-gold">✓</span> Post opportunities
                </li>
                <li className="flex items-center gap-2 text-caption text-soft-grey">
                  <span className="text-matte-gold">✓</span> Get matched with talent
                </li>
                <li className="flex items-center gap-2 text-caption text-soft-grey">
                  <span className="text-matte-gold">✓</span> Manage your stores
                </li>
              </ul>
            </Card>
          </Grid>

          <Text variant="caption" className="mt-8 text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-charcoal underline underline-offset-4 hover:text-matte-gold">
              Sign in
            </Link>
          </Text>
        </div>
      </main>
    );
  }

  // Step 2: Signup form
  return (
    <main className="flex min-h-screen items-center justify-center px-comfortable py-expansive">
      <div className="w-full max-w-md">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <H2>Tailor Shift</H2>
          </Link>
          <Text className="mt-2 text-soft-grey">
            Create your {userType === "brand" ? "brand" : "professional"} account
          </Text>
        </div>

        {/* Back button */}
        <button
          onClick={() => {
            setStep("select");
            setUserType(null);
          }}
          className="mt-6 flex items-center gap-2 text-caption text-soft-grey hover:text-charcoal"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Change selection
        </button>

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="mt-6">
          <Stack gap="lg">
            {error && (
              <div className="rounded border border-error/20 bg-error/5 p-4 text-sm text-error">
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
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
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
            />

            <Button type="submit" loading={loading} className="w-full">
              Create Account
            </Button>
          </Stack>
        </form>

        {/* Divider */}
        <div className="mt-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-concrete" />
          <Text variant="caption">or continue with</Text>
          <div className="h-px flex-1 bg-concrete" />
        </div>

        {/* OAuth Buttons */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => handleOAuthSignup("google")}
            disabled={loading}
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => handleOAuthSignup("linkedin_oidc")}
            disabled={loading}
          >
            <svg className="mr-2 h-5 w-5" fill="#0A66C2" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            LinkedIn
          </Button>
        </div>

        {/* Login link */}
        <Text variant="caption" className="mt-8 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-charcoal underline underline-offset-4 hover:text-matte-gold">
            Sign in
          </Link>
        </Text>
      </div>
    </main>
  );
}

function SignupLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center px-comfortable py-expansive">
      <div className="w-full max-w-md text-center">
        <H2>Tailor Shift</H2>
        <Text variant="body" className="mt-4 text-soft-grey">
          Loading...
        </Text>
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
