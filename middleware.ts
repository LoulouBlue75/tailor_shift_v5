import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Public routes - no auth required
  const publicRoutes = ["/", "/login", "/signup", "/forgot-password", "/auth/callback", "/auth/reset-password", "/terms", "/privacy", "/brands", "/professionals"];
  const isPublicRoute = publicRoutes.some(
    (route) => path === route || path.startsWith("/auth/")
  );

  // Skip Supabase check for public routes if credentials not configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    if (isPublicRoute) {
      return NextResponse.next();
    }
    // Redirect to home if trying to access protected routes without Supabase config
    return NextResponse.redirect(new URL("/", request.url));
  }

  const { user, supabaseResponse, supabase } = await updateSession(request);

  if (isPublicRoute) {
    return supabaseResponse;
  }

  // Protected routes - require auth
  // Note: Using "/talent/" and "/brand/" with trailing slash to avoid matching "/brands" and "/professionals"
  if (path.startsWith("/talent/") || path.startsWith("/brand/")) {
    if (!user) {
      const redirectUrl = new URL("/login", request.url);
      redirectUrl.searchParams.set("redirect", path);
      return NextResponse.redirect(redirectUrl);
    }

    // Get user profile to check user_type
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("user_type")
      .eq("id", user.id)
      .single();

    // Handle case where profile doesn't exist or can't be read (prevents redirect loop)
    if (profileError || !profile) {
      console.error("Middleware: Could not fetch profile for user", user.id, profileError?.message);
      // Redirect to signup to fix the account state - don't create a loop
      const signupUrl = new URL("/signup", request.url);
      signupUrl.searchParams.set("error", "profile_missing");
      return NextResponse.redirect(signupUrl);
    }

    // Handle case where user_type is null/undefined (prevents redirect loop)
    if (!profile.user_type) {
      console.error("Middleware: user_type is null for user", user.id);
      // Redirect to signup to set the user type
      const signupUrl = new URL("/signup", request.url);
      signupUrl.searchParams.set("error", "type_missing");
      return NextResponse.redirect(signupUrl);
    }

    // Verify user_type matches the route
    if (path.startsWith("/talent") && profile.user_type !== "talent") {
      return NextResponse.redirect(new URL("/brand/dashboard", request.url));
    }

    if (path.startsWith("/brand") && profile.user_type !== "brand") {
      return NextResponse.redirect(new URL("/talent/dashboard", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
