"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updatePasswordAction } from "@/app/actions/auth";
import { Button, Input, H2, Text, Stack } from "@/components/ui";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("password", password);

    const result = await updatePasswordAction(formData);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center px-comfortable py-expansive">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
            <svg
              className="h-8 w-8 text-success"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <H2 className="mt-6">Password Updated</H2>
          <Text className="mt-4 text-soft-grey">
            Your password has been successfully updated. Redirecting to login...
          </Text>
          <Link
            href="/login"
            className="mt-8 inline-block text-caption text-charcoal underline underline-offset-4 hover:text-matte-gold"
          >
            Go to login now
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
          <Text className="mt-2 text-soft-grey">Set your new password</Text>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8">
          <Stack gap="lg">
            {error && (
              <div className="rounded border border-error/20 bg-error/5 p-4 text-sm text-error">
                {error}
              </div>
            )}

            <Input
              label="New Password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Min. 8 characters"
              helperText="Must be at least 8 characters"
            />

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm your password"
            />

            <Button type="submit" loading={loading} className="w-full">
              Update Password
            </Button>
          </Stack>
        </form>
      </div>
    </main>
  );
}
