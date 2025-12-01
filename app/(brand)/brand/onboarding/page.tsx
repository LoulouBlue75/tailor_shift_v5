import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function BrandOnboardingIndex() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check if brand profile exists and determine which step to show
  const { data: brand } = await supabase
    .from("brands")
    .select("id, name, segment")
    .eq("profile_id", user.id)
    .single();

  // If no brand at all, go to identity step
  if (!brand || !brand.name || brand.name === "Pending") {
    redirect("/brand/onboarding/identity");
  }

  // If brand exists but no segment, still in identity
  if (!brand.segment) {
    redirect("/brand/onboarding/identity");
  }

  // Check contact info (stored in description field)
  const { data: brandFull } = await supabase
    .from("brands")
    .select("description")
    .eq("id", brand.id)
    .single();

  if (!brandFull?.description) {
    redirect("/brand/onboarding/contact");
  }

  // Check if store exists
  const { data: stores } = await supabase
    .from("stores")
    .select("id")
    .eq("brand_id", brand.id)
    .limit(1);

  if (!stores || stores.length === 0) {
    redirect("/brand/onboarding/store");
  }

  // All done, go to opportunity intro
  redirect("/brand/onboarding/opportunity-intro");
}
