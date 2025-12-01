"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button, Input, H2, Text, Divider, Stack } from "@/components/ui";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Get user profile to determine redirect
    const { data: profile } = await supabase
      .from("profiles")
      .select("user_type")
      .eq("id", data.user?.id)
      .single();

    const destination = profile?.user_type === "brand" 
      ? "/brand/dashboard" 
      : "/talent/dashboard";

    router.push(redirectTo !== "/" ? redirectTo : destination);
    router.refresh();
  };

  const handleOAuthLogin = async (provider: "google" | "linkedin_oidc") => {
    setLoading(true);
    const supabase = createClient();
    
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${redirectTo}`,
      },
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-comfortable py-expansive">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <H2>Tailor Shift</H2>
          </Link>
          <Text variant="body" className="mt-2 text-soft-grey">
            Welcome back
          </Text>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="mt-8">
          <Stack gap="lg">
            {error && (
              <div className="rounded border border-error/20 bg-error/5 p-4 text-sm text-error">
                {error}
              </div>
            )}

            <Input
              label="Email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />

            <div>
              <Input
                label="Password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
              <div className="mt-2 text-right">
                <Link
                  href="/forgot-password"
                  className="text-caption text-soft-grey hover:text-charcoal"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button type="submit" loading={loading} className="w-full">
              Sign In
            </Button>
          </Stack>
        </form>

        {/* Divider */}
        <div className="mt-8 flex items-center gap-4">
          <Divider className="flex-1" />
          <Text variant="caption">or continue with</Text>
          <Divider className="flex-1" />
        </div>

        {/* OAuth Buttons */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => handleOAuthLogin("google")}
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
            onClick={() => handleOAuthLogin("linkedin_oidc")}
            disabled={loading}
          >
            <svg className="mr-2 h-5 w-5" fill="#0A66C2" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            LinkedIn
          </Button>
        </div>

        {/* Sign up link */}
        <Text variant="caption" className="mt-8 text-center">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-charcoal underline underline-offset-4 hover:text-matte-gold">
            Sign up
          </Link>
        </Text>
      </div>
    </main>
  );
}

function LoginLoading() {
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

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginForm />
    </Suspense>
  );
}
