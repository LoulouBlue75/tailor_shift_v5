"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";

// Validation schemas
const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  userType: z.enum(["talent", "brand"]),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// Types
type ActionResult = {
  error?: string;
  success?: boolean;
  message?: string;
};

/**
 * Sign up a new user
 */
export async function signupAction(formData: FormData): Promise<ActionResult> {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
    fullName: formData.get("fullName"),
    userType: formData.get("userType"),
  };

  const parsed = signupSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const { email, password, fullName, userType } = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        user_type: userType,
        full_name: fullName,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error) {
    if (error.message.includes("already registered")) {
      return { error: "An account with this email already exists" };
    }
    return { error: error.message };
  }

  return {
    success: true,
    message: "Check your email for a confirmation link",
  };
}

/**
 * Sign in an existing user
 */
export async function loginAction(formData: FormData): Promise<ActionResult> {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = loginSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const { email, password } = parsed.data;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.message.includes("Invalid login")) {
      return { error: "Invalid email or password" };
    }
    return { error: error.message };
  }

  // Get user profile to determine redirect
  const { data: profile } = await supabase
    .from("profiles")
    .select("user_type, onboarding_completed")
    .eq("id", data.user.id)
    .single();

  // Determine redirect path
  const redirectPath =
    profile?.user_type === "brand"
      ? profile.onboarding_completed
        ? "/brand/dashboard"
        : "/brand/onboarding"
      : profile?.onboarding_completed
        ? "/talent/dashboard"
        : "/talent/onboarding";

  redirect(redirectPath);
}

/**
 * Sign out the current user
 */
export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

/**
 * Request password reset email
 */
export async function resetPasswordAction(
  formData: FormData
): Promise<ActionResult> {
  const rawData = {
    email: formData.get("email"),
  };

  const parsed = resetPasswordSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const { email } = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return {
    success: true,
    message: "If an account exists, you will receive a reset email",
  };
}

/**
 * Update password (after reset)
 */
export async function updatePasswordAction(
  formData: FormData
): Promise<ActionResult> {
  const password = formData.get("password") as string;

  if (!password || password.length < 8) {
    return { error: "Password must be at least 8 characters" };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    return { error: error.message };
  }

  return {
    success: true,
    message: "Password updated successfully",
  };
}
