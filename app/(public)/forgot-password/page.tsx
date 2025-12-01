"use client";

import { useState } from "react";
import Link from "next/link";
import { resetPasswordAction } from "@/app/actions/auth";
import { Button, Input, H2, Text, Stack } from "@/components/ui";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("email", email);

    const result = await resetPasswordAction(formData);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center px-comfortable py-expansive">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-matte-gold/10">
            <svg
              className="h-8 w-8 text-matte-gold"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <H2 className="mt-6">Check Your Email</H2>
          <Text className="mt-4 text-soft-grey">
            If an account exists for <strong className="text-charcoal">{email}</strong>,
            you will receive a password reset link shortly.
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

  return (
    <main className="flex min-h-screen items-center justify-center px-comfortable py-expansive">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <H2>Tailor Shift</H2>
          </Link>
          <Text className="mt-2 text-soft-grey">Reset your password</Text>
        </div>

        <Text variant="caption" className="mt-6 text-center">
          Enter your email address and we&apos;ll send you a link to reset your
          password.
        </Text>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8">
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

            <Button type="submit" loading={loading} className="w-full">
              Send Reset Link
            </Button>
          </Stack>
        </form>

        {/* Back to login */}
        <Text variant="caption" className="mt-8 text-center">
          Remember your password?{" "}
          <Link
            href="/login"
            className="text-charcoal underline underline-offset-4 hover:text-matte-gold"
          >
            Sign in
          </Link>
        </Text>
      </div>
    </main>
  );
}
