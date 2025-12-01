import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const type = requestUrl.searchParams.get("type"); // user_type for OAuth
  const redirect = requestUrl.searchParams.get("redirect");
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // If OAuth signup, update user metadata with type
      if (type && (type === "talent" || type === "brand")) {
        await supabase.auth.updateUser({
          data: { user_type: type },
        });
        
        // Update profile with user_type
        await supabase
          .from("profiles")
          .update({ user_type: type })
          .eq("id", data.user.id);
      }

      // Get user profile to determine redirect
      const { data: profile } = await supabase
        .from("profiles")
        .select("user_type, onboarding_completed")
        .eq("id", data.user.id)
        .single();

      // Determine redirect destination
      let destination = redirect || "/";
      
      if (!redirect || redirect === "/") {
        if (profile?.user_type === "brand") {
          destination = profile.onboarding_completed 
            ? "/brand/dashboard" 
            : "/brand/onboarding";
        } else {
          destination = profile?.onboarding_completed 
            ? "/talent/dashboard" 
            : "/talent/onboarding";
        }
      }

      return NextResponse.redirect(`${origin}${destination}`);
    }
  }

  // If there's an error, redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}
