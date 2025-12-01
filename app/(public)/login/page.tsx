"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button, Input, H2, Text, Card } from "@/components/ui";

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
    <main className="min-h-screen flex items-center justify-center p-comfortable bg-ivory">
      <div className="w-full max-w-md">
        <Card className="p-10 border-none shadow-elevated bg-ivory-light">
          {/* Header */}
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
            <H2 className="text-3xl mb-2">Welcome Back</H2>
            <Text className="text-grey-warm">
              Please enter your credentials to access your account
            </Text>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="rounded bg-error/10 p-4 text-sm text-error border border-error/20">
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
              placeholder="name@company.com"
              className="bg-white"
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
                className="bg-white"
              />
              <div className="mt-2 text-right">
                <Link
                  href="/forgot-password"
                  className="text-caption text-grey-warm hover:text-gold-dark transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button type="submit" loading={loading} className="w-full" size="lg">
              Sign In
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
              onClick={() => handleOAuthLogin("google")}
              disabled={loading}
              className="bg-white"
            >
              <span className="mr-2">G</span> Google
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => handleOAuthLogin("linkedin_oidc")}
              disabled={loading}
              className="bg-white"
            >
              <span className="mr-2">in</span> LinkedIn
            </Button>
          </div>

          {/* Sign up link */}
          <div className="mt-8 text-center">
            <Text variant="caption">
              Don't have an account?{" "}
              <Link href="/signup" className="text-charcoal font-medium hover:text-gold-dark transition-colors underline underline-offset-4">
                Sign up
              </Link>
            </Text>
          </div>
        </Card>
      </div>
    </main>
  );
}

function LoginLoading() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-ivory">
      <div className="flex flex-col items-center">
        <div className="h-12 w-12 animate-pulse rounded-full bg-gold/20 mb-4" />
        <Text className="text-grey-warm">Loading...</Text>
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
