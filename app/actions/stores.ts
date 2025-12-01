"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ============================================================================
// Types
// ============================================================================

export interface StoreData {
  name: string;
  code?: string;
  city: string;
  country: string;
  region: "EMEA" | "Americas" | "APAC" | "Middle_East";
  address?: string;
  tier: "T1" | "T2" | "T3" | "T4" | "T5";
  divisions: string[];
  teamSize?: number;
}

// ============================================================================
// Server Actions
// ============================================================================

export async function createStore(data: StoreData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Validation
  if (!data.name || data.name.length < 2) {
    return { success: false, error: "Store name must be at least 2 characters" };
  }
  if (!data.city) {
    return { success: false, error: "City is required" };
  }
  if (!data.country) {
    return { success: false, error: "Country is required" };
  }
  if (!data.tier) {
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
    return { success: false, error: "Brand not found" };
  }

  // Create store
  const { data: newStore, error } = await supabase
    .from("stores")
    .insert({
      brand_id: brand.id,
      name: data.name,
      tier: data.tier,
      city: data.city,
      country: data.country,
      region: data.region,
      address: data.address || null,
      divisions: data.divisions,
      team_size: data.teamSize || null,
      status: "active",
    })
    .select("id")
    .single();

  if (error) {
    console.error("Error creating store:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/brand/stores");
  revalidatePath("/brand/dashboard");
  return { success: true, storeId: newStore?.id };
}

export async function updateStore(id: string, data: StoreData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Validation
  if (!data.name || data.name.length < 2) {
    return { success: false, error: "Store name must be at least 2 characters" };
  }
  if (!data.city) {
    return { success: false, error: "City is required" };
  }
  if (!data.country) {
    return { success: false, error: "Country is required" };
  }
  if (!data.tier) {
    return { success: false, error: "Store tier is required" };
  }
  if (!data.divisions || data.divisions.length === 0) {
    return { success: false, error: "At least one division is required" };
  }

  // Verify ownership
  const { data: brand } = await supabase
    .from("brands")
    .select("id")
    .eq("profile_id", user.id)
    .single();

  const { data: store } = await supabase
    .from("stores")
    .select("brand_id")
    .eq("id", id)
    .single();

  if (!store || store.brand_id !== brand?.id) {
    return { success: false, error: "Store not found or unauthorized" };
  }

  // Update store
  const { error } = await supabase
    .from("stores")
    .update({
      name: data.name,
      tier: data.tier,
      city: data.city,
      country: data.country,
      region: data.region,
      address: data.address || null,
      divisions: data.divisions,
      team_size: data.teamSize || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating store:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/brand/stores");
  revalidatePath(`/brand/stores/${id}`);
  revalidatePath("/brand/dashboard");
  return { success: true };
}

export async function deleteStore(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Verify ownership
  const { data: brand } = await supabase
    .from("brands")
    .select("id")
    .eq("profile_id", user.id)
    .single();

  const { data: store } = await supabase
    .from("stores")
    .select("brand_id")
    .eq("id", id)
    .single();

  if (!store || store.brand_id !== brand?.id) {
    return { success: false, error: "Store not found or unauthorized" };
  }

  // Check for active opportunities
  const { data: activeOpps } = await supabase
    .from("opportunities")
    .select("id")
    .eq("store_id", id)
    .eq("status", "active");

  if (activeOpps && activeOpps.length > 0) {
    return { 
      success: false, 
      error: `Cannot delete store with ${activeOpps.length} active opportunit${activeOpps.length === 1 ? 'y' : 'ies'}. Please close or reassign them first.`
    };
  }

  // Delete store
  const { error } = await supabase
    .from("stores")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting store:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/brand/stores");
  revalidatePath("/brand/dashboard");
  return { success: true };
}

export async function getStore(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null;
  }

  // Verify ownership
  const { data: brand } = await supabase
    .from("brands")
    .select("id")
    .eq("profile_id", user.id)
    .single();

  const { data: store } = await supabase
    .from("stores")
    .select("*")
    .eq("id", id)
    .eq("brand_id", brand?.id || "")
    .single();

  return store;
}

export async function getStores() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return [];
  }

  const { data: brand } = await supabase
    .from("brands")
    .select("id")
    .eq("profile_id", user.id)
    .single();

  if (!brand) {
    return [];
  }

  const { data: stores } = await supabase
    .from("stores")
    .select("*")
    .eq("brand_id", brand.id)
    .order("created_at", { ascending: false });

  return stores || [];
}

export async function getStoreWithOpportunities(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null;
  }

  // Verify ownership
  const { data: brand } = await supabase
    .from("brands")
    .select("id")
    .eq("profile_id", user.id)
    .single();

  const { data: store } = await supabase
    .from("stores")
    .select("*")
    .eq("id", id)
    .eq("brand_id", brand?.id || "")
    .single();

  if (!store) {
    return null;
  }

  // Get opportunities for this store
  const { data: opportunities } = await supabase
    .from("opportunities")
    .select("*")
    .eq("store_id", id)
    .order("created_at", { ascending: false });

  return { store, opportunities: opportunities || [] };
}
