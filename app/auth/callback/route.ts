import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const type = requestUrl.searchParams.get("type"); // user_type for OAuth signup
  const redirect = requestUrl.searchParams.get("redirect");
  const origin = requestUrl.origin;

  console.log("Auth callback - code:", !!code, "type:", type, "redirect:", redirect);

  if (!code) {
    console.error("No code provided in callback");
    return NextResponse.redirect(`${origin}/login?error=no_code`);
  }

  try {
    const supabase = await createClient();
    
    // Exchange code for session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Error exchanging code:", error.message);
      return NextResponse.redirect(`${origin}/login?error=exchange_failed`);
    }

    if (!data.user) {
      console.error("No user returned after code exchange");
      return NextResponse.redirect(`${origin}/login?error=no_user`);
    }

    console.log("User authenticated:", data.user.id);

    // Wait a bit for the trigger to create the profile
    await new Promise(resolve => setTimeout(resolve, 500));

    // Try to get existing profile
    let { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, user_type, onboarding_completed")
      .eq("id", data.user.id)
      .single();

    console.log("Profile lookup:", profile, profileError?.message);

    // If profile doesn't exist, the trigger should have created it
    // If it still doesn't exist, create it manually
    if (profileError && profileError.code === "PGRST116") {
      console.log("Profile not found, creating manually...");
      
      const userType = type || "talent";
      const { error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: data.user.id,
          email: data.user.email || "",
          user_type: userType,
          full_name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || null,
          onboarding_completed: false,
        });

      if (insertError) {
        console.error("Error creating profile:", insertError.message);
      } else {
        profile = {
          id: data.user.id,
          user_type: userType,
          onboarding_completed: false,
        };
      }
    }

    // If we have a type from signup, update the profile
    if (type && (type === "talent" || type === "brand")) {
      console.log("Updating profile with type:", type);
      
      // Update user metadata
      await supabase.auth.updateUser({
        data: { user_type: type },
      });

      // Update profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ user_type: type })
        .eq("id", data.user.id);

      if (updateError) {
        console.error("Error updating profile type:", updateError.message);
      } else {
        // Update our local profile object
        if (profile) {
          profile.user_type = type;
        }
      }
    }

    // Determine final user type
    const userType = profile?.user_type || type || "talent";
    const onboardingCompleted = profile?.onboarding_completed || false;

    console.log("Final state - userType:", userType, "onboardingCompleted:", onboardingCompleted);

    // Determine redirect destination
    let destination: string;

    if (redirect && redirect !== "/" && redirect !== "") {
      // Use provided redirect if valid
      destination = redirect;
    } else if (userType === "brand") {
      destination = onboardingCompleted ? "/brand/dashboard" : "/brand/onboarding";
    } else {
      destination = onboardingCompleted ? "/talent/dashboard" : "/talent/onboarding";
    }

    console.log("Redirecting to:", destination);
    return NextResponse.redirect(`${origin}${destination}`);

  } catch (err) {
    console.error("Unexpected error in auth callback:", err);
    return NextResponse.redirect(`${origin}/login?error=callback_error`);
  }
}
