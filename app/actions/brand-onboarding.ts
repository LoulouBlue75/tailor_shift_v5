"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ============================================================================
// Types
// ============================================================================

export interface BrandIdentityData {
  name: string;
  logoUrl?: string;
  website?: string;
  segment: "ultra_luxury" | "luxury" | "premium" | "accessible_luxury";
  divisions: string[];
  headquartersLocation?: string;
}

export interface BrandContactData {
  contactName: string;
  contactRole: string;
  contactEmail: string;
  contactPhone?: string;
}

export interface StoreData {
  name: string;
  code?: string;
  city: string;
  country: string;
  region: "EMEA" | "Americas" | "APAC" | "Middle_East";
  address?: string;
  complexityTier: "T1" | "T2" | "T3" | "T4" | "T5";
  divisions: string[];
  teamSize?: number;
}

// ============================================================================
// Constants
// ============================================================================

export const BRAND_SEGMENTS = [
  { value: "ultra_luxury", label: "Ultra Luxury" },
  { value: "luxury", label: "Luxury" },
  { value: "premium", label: "Premium" },
  { value: "accessible_luxury", label: "Accessible Luxury" },
] as const;

export const REGIONS = [
  { value: "EMEA", label: "EMEA (Europe, Middle East & Africa)" },
  { value: "Americas", label: "Americas" },
  { value: "APAC", label: "Asia Pacific" },
  { value: "Middle_East", label: "Middle East" },
] as const;

export const STORE_TIERS = [
  { value: "T1", label: "T1 - Flagship XXL", description: "Major flagship stores in prime locations" },
  { value: "T2", label: "T2 - Flagship", description: "Standard flagship stores" },
  { value: "T3", label: "T3 - Full Format", description: "Full range boutiques" },
  { value: "T4", label: "T4 - Boutique", description: "Smaller boutiques" },
  { value: "T5", label: "T5 - Outlet/Travel Retail", description: "Outlet or travel retail locations" },
] as const;

// Country to Region mapping
export const COUNTRY_REGION_MAP: Record<string, "EMEA" | "Americas" | "APAC" | "Middle_East"> = {
  // EMEA
  "France": "EMEA",
  "United Kingdom": "EMEA",
  "Germany": "EMEA",
  "Italy": "EMEA",
  "Spain": "EMEA",
  "Switzerland": "EMEA",
  "Netherlands": "EMEA",
  "Belgium": "EMEA",
  "Austria": "EMEA",
  "Sweden": "EMEA",
  "Norway": "EMEA",
  "Denmark": "EMEA",
  "Finland": "EMEA",
  "Portugal": "EMEA",
  "Greece": "EMEA",
  "Poland": "EMEA",
  "Czech Republic": "EMEA",
  "Ireland": "EMEA",
  "Russia": "EMEA",
  // Americas
  "United States": "Americas",
  "Canada": "Americas",
  "Mexico": "Americas",
  "Brazil": "Americas",
  "Argentina": "Americas",
  "Chile": "Americas",
  "Colombia": "Americas",
  // APAC
  "Japan": "APAC",
  "China": "APAC",
  "South Korea": "APAC",
  "Hong Kong": "APAC",
  "Singapore": "APAC",
  "Australia": "APAC",
  "New Zealand": "APAC",
  "Thailand": "APAC",
  "Malaysia": "APAC",
  "Indonesia": "APAC",
  "Vietnam": "APAC",
  "India": "APAC",
  "Taiwan": "APAC",
  // Middle East
  "United Arab Emirates": "Middle_East",
  "Saudi Arabia": "Middle_East",
  "Qatar": "Middle_East",
  "Kuwait": "Middle_East",
  "Bahrain": "Middle_East",
  "Oman": "Middle_East",
};

export const COUNTRIES = Object.keys(COUNTRY_REGION_MAP);

// ============================================================================
// Server Actions
// ============================================================================

export async function saveBrandIdentity(data: BrandIdentityData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Validation
  if (!data.name || data.name.length < 2) {
    return { success: false, error: "Brand name must be at least 2 characters" };
  }
  if (!data.segment) {
    return { success: false, error: "Segment is required" };
  }
  if (!data.divisions || data.divisions.length === 0) {
    return { success: false, error: "At least one division is required" };
  }

  // Check if brand exists
  const { data: existingBrand } = await supabase
    .from("brands")
    .select("id")
    .eq("profile_id", user.id)
    .single();

  if (existingBrand) {
    // Update existing
    const { error } = await supabase
      .from("brands")
      .update({
        name: data.name,
        logo_url: data.logoUrl || null,
        website_url: data.website || null,
        segment: data.segment,
        divisions: data.divisions,
        headquarters_location: data.headquartersLocation || null,
        primary_division: data.divisions[0] || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingBrand.id);

    if (error) {
      console.error("Error updating brand:", error);
      return { success: false, error: error.message };
    }
  } else {
    // Create new
    const { error } = await supabase
      .from("brands")
      .insert({
        profile_id: user.id,
        name: data.name,
        logo_url: data.logoUrl || null,
        website_url: data.website || null,
        segment: data.segment,
        divisions: data.divisions,
        headquarters_location: data.headquartersLocation || null,
        primary_division: data.divisions[0] || null,
        verified: false,
      });

    if (error) {
      console.error("Error creating brand:", error);
      return { success: false, error: error.message };
    }
  }

  revalidatePath("/brand/onboarding");
  return { success: true };
}

export async function saveBrandContact(data: BrandContactData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Validation
  if (!data.contactName || data.contactName.length < 2) {
    return { success: false, error: "Contact name is required" };
  }
  if (!data.contactRole) {
    return { success: false, error: "Contact role is required" };
  }
  if (!data.contactEmail) {
    return { success: false, error: "Contact email is required" };
  }
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.contactEmail)) {
    return { success: false, error: "Invalid email format" };
  }

  // Update brand with contact info
  const { error } = await supabase
    .from("brands")
    .update({
      description: JSON.stringify({
        contact_name: data.contactName,
        contact_role: data.contactRole,
        contact_email: data.contactEmail,
        contact_phone: data.contactPhone || null,
      }),
      updated_at: new Date().toISOString(),
    })
    .eq("profile_id", user.id);

  if (error) {
    console.error("Error saving contact info:", error);
    return { success: false, error: error.message };
  }

  // Also update profile full_name if not set
  await supabase
    .from("profiles")
    .update({ full_name: data.contactName })
    .eq("id", user.id)
    .is("full_name", null);

  revalidatePath("/brand/onboarding");
  return { success: true };
}

export async function saveFirstStore(data: StoreData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Validation
  if (!data.name || data.name.length < 2) {
    return { success: false, error: "Store name is required" };
  }
  if (!data.city) {
    return { success: false, error: "City is required" };
  }
  if (!data.country) {
    return { success: false, error: "Country is required" };
  }
  if (!data.complexityTier) {
    return { success: false, error: "Store tier is required" };
  }
  if (!data.divisions || data.divisions.length === 0) {
    return { success: false, error: "At least one division is required" };
  }

  // Get brand ID
  const { data: brand, error: brandError } = await supabase
    .from("brands")
    .select("id")
    .eq("profile_id", user.id)
    .single();

  if (brandError || !brand) {
    return { success: false, error: "Brand not found. Please complete identity step first." };
  }

  // Create store
  const { error } = await supabase
    .from("stores")
    .insert({
      brand_id: brand.id,
      name: data.name,
      tier: data.complexityTier,
      city: data.city,
      country: data.country,
      region: data.region,
      address: data.address || null,
      divisions: data.divisions,
      team_size: data.teamSize || null,
      status: "active",
    });

  if (error) {
    console.error("Error creating store:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/brand/onboarding");
  return { success: true };
}

export async function completeBrandOnboarding() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Update profile onboarding status
  const { error } = await supabase
    .from("profiles")
    .update({
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    console.error("Error completing onboarding:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/brand");
  return { success: true };
}

export async function getBrandOnboardingData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null;
  }

  const { data: brand } = await supabase
    .from("brands")
    .select("*")
    .eq("profile_id", user.id)
    .single();

  const { data: stores } = await supabase
    .from("stores")
    .select("*")
    .eq("brand_id", brand?.id || "")
    .order("created_at", { ascending: true });

  return { brand, stores: stores || [] };
}

export async function uploadBrandLogo(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const file = formData.get("logo") as File;
  if (!file) {
    return { success: false, error: "No file provided" };
  }

  // Validate file type
  const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return { success: false, error: "Invalid file type. Allowed: PNG, JPG, SVG, WebP" };
  }

  // Validate file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    return { success: false, error: "File too large. Maximum size is 5MB" };
  }

  // Get or create brand
  let { data: brand } = await supabase
    .from("brands")
    .select("id")
    .eq("profile_id", user.id)
    .single();

  if (!brand) {
    // Create placeholder brand for storage
    const { data: newBrand, error: createError } = await supabase
      .from("brands")
      .insert({
        profile_id: user.id,
        name: "Pending",
        divisions: [],
        verified: false,
      })
      .select("id")
      .single();

    if (createError) {
      return { success: false, error: "Failed to prepare brand" };
    }
    brand = newBrand;
  }

  // Upload file
  const ext = file.name.split(".").pop();
  const filePath = `brands/${brand.id}/logo.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("brand-assets")
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    console.error("Upload error:", uploadError);
    return { success: false, error: "Failed to upload logo" };
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from("brand-assets")
    .getPublicUrl(filePath);

  // Update brand with logo URL
  await supabase
    .from("brands")
    .update({ logo_url: publicUrl })
    .eq("id", brand.id);

  return { success: true, url: publicUrl };
}
