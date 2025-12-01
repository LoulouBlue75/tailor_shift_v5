"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { generateMatchesForTalent } from "./matching";
import type {
  RoleLevel,
  StoreTier,
  Division,
  Mobility,
  Timeline,
  ExperienceBlockType,
} from "@/lib/supabase/database.types";

// ============================================================================
// SCHEMAS
// ============================================================================

const identitySchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phone: z.string().optional().nullable(),
  linkedinUrl: z.string().url("Invalid LinkedIn URL").optional().nullable().or(z.literal("")),
});

const professionalSchema = z.object({
  currentRoleLevel: z.enum(["L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8"]),
  currentStoreTier: z.enum(["T1", "T2", "T3", "T4", "T5"]),
  yearsInLuxury: z.number().min(0).max(50),
  currentMaison: z.string().optional().nullable(),
  currentLocation: z.string().optional().nullable(),
});

const divisionsSchema = z.object({
  divisions: z
    .array(
      z.enum([
        "fashion",
        "leather_goods",
        "shoes",
        "beauty",
        "fragrance",
        "watches",
        "high_jewelry",
        "eyewear",
        "accessories",
      ])
    )
    .min(1, "Select at least one division")
    .max(5, "Select up to 5 divisions"),
});

const preferencesSchema = z.object({
  targetRoleLevels: z
    .array(z.enum(["L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8"]))
    .min(1, "Select at least one target role"),
  targetStoreTiers: z.array(z.enum(["T1", "T2", "T3", "T4", "T5"])).optional(),
  targetDivisions: z
    .array(
      z.enum([
        "fashion",
        "leather_goods",
        "shoes",
        "beauty",
        "fragrance",
        "watches",
        "high_jewelry",
        "eyewear",
        "accessories",
      ])
    )
    .optional(),
  targetLocations: z.array(z.string()).optional(),
  mobility: z.enum(["local", "regional", "national", "international"]),
  timeline: z.enum(["active", "passive", "not_looking"]),
});

const experienceSchema = z.object({
  blockType: z.enum(["foh", "boh", "leadership", "clienteling", "operations", "business"]),
  title: z.string().min(2, "Title is required"),
  company: z.string().min(1, "Company is required"),
  location: z.string().optional().nullable(),
  startDate: z.string(),
  endDate: z.string().optional().nullable(),
  isCurrent: z.boolean(),
  roleLevel: z.enum(["L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8"]).optional(),
  storeTier: z.enum(["T1", "T2", "T3", "T4", "T5"]).optional(),
  division: z
    .enum([
      "fashion",
      "leather_goods",
      "shoes",
      "beauty",
      "fragrance",
      "watches",
      "high_jewelry",
      "eyewear",
      "accessories",
    ])
    .optional(),
  achievements: z.array(z.string()).optional(),
});

// ============================================================================
// HELPER: Get or create talent record
// ============================================================================

async function getOrCreateTalent() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  // Check if talent record exists
  const { data: existing } = await supabase
    .from("talents")
    .select("id")
    .eq("profile_id", user.id)
    .single();

  if (existing) {
    return { talentId: existing.id, userId: user.id };
  }

  // Create talent record with placeholder values
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const nameParts = (profile?.full_name || "New User").split(" ");
  const firstName = nameParts[0] || "New";
  const lastName = nameParts.slice(1).join(" ") || "User";

  const { data: newTalent, error } = await supabase
    .from("talents")
    .insert({
      profile_id: user.id,
      first_name: firstName,
      last_name: lastName,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(`Failed to create talent: ${error.message}`);
  }

  return { talentId: newTalent.id, userId: user.id };
}

// ============================================================================
// SERVER ACTIONS
// ============================================================================

type ActionState = { error: string } | null;

export async function saveIdentity(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const rawData = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    phone: formData.get("phone") || null,
    linkedinUrl: formData.get("linkedinUrl") || null,
  };

  const parsed = identitySchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const { talentId } = await getOrCreateTalent();
  const supabase = await createClient();

  const { error } = await supabase
    .from("talents")
    .update({
      first_name: parsed.data.firstName,
      last_name: parsed.data.lastName,
      phone: parsed.data.phone,
      linkedin_url: parsed.data.linkedinUrl || null,
    })
    .eq("id", talentId);

  if (error) {
    return { error: error.message };
  }

  redirect("/talent/onboarding/professional");
}

export async function saveProfessional(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const rawData = {
    currentRoleLevel: formData.get("currentRoleLevel"),
    currentStoreTier: formData.get("currentStoreTier"),
    yearsInLuxury: parseInt(formData.get("yearsInLuxury") as string) || 0,
    currentMaison: formData.get("currentMaison") || null,
    currentLocation: formData.get("currentLocation") || null,
  };

  const parsed = professionalSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const { talentId } = await getOrCreateTalent();
  const supabase = await createClient();

  const { error } = await supabase
    .from("talents")
    .update({
      current_role_level: parsed.data.currentRoleLevel,
      current_store_tier: parsed.data.currentStoreTier,
      years_in_luxury: parsed.data.yearsInLuxury,
      current_maison: parsed.data.currentMaison,
      current_location: parsed.data.currentLocation,
    })
    .eq("id", talentId);

  if (error) {
    return { error: error.message };
  }

  redirect("/talent/onboarding/divisions");
}

export async function saveDivisions(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const divisions = formData.getAll("divisions") as Division[];

  const parsed = divisionsSchema.safeParse({ divisions });
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const { talentId } = await getOrCreateTalent();
  const supabase = await createClient();

  const { error } = await supabase
    .from("talents")
    .update({
      divisions_expertise: parsed.data.divisions,
    })
    .eq("id", talentId);

  if (error) {
    return { error: error.message };
  }

  redirect("/talent/onboarding/preferences");
}

export async function savePreferences(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const rawData = {
    targetRoleLevels: formData.getAll("targetRoleLevels") as RoleLevel[],
    targetStoreTiers: formData.getAll("targetStoreTiers") as StoreTier[],
    targetDivisions: formData.getAll("targetDivisions") as Division[],
    targetLocations: (formData.get("targetLocations") as string)?.split(",").filter(Boolean) || [],
    mobility: formData.get("mobility") as Mobility,
    timeline: formData.get("timeline") as Timeline,
  };

  const parsed = preferencesSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const { talentId } = await getOrCreateTalent();
  const supabase = await createClient();

  const { error } = await supabase
    .from("talents")
    .update({
      career_preferences: {
        target_role_levels: parsed.data.targetRoleLevels,
        target_store_tiers: parsed.data.targetStoreTiers || [],
        target_divisions: parsed.data.targetDivisions || [],
        target_locations: parsed.data.targetLocations || [],
        mobility: parsed.data.mobility,
        timeline: parsed.data.timeline,
      },
    })
    .eq("id", talentId);

  if (error) {
    return { error: error.message };
  }

  redirect("/talent/onboarding/experience");
}

export async function saveExperience(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const rawData = {
    blockType: formData.get("blockType") as ExperienceBlockType,
    title: formData.get("title") as string,
    company: formData.get("company") as string,
    location: formData.get("location") || null,
    startDate: formData.get("startDate") as string,
    endDate: formData.get("endDate") || null,
    isCurrent: formData.get("isCurrent") === "true",
    roleLevel: formData.get("roleLevel") || undefined,
    storeTier: formData.get("storeTier") || undefined,
    division: formData.get("division") || undefined,
    achievements: (formData.get("achievements") as string)?.split("\n").filter(Boolean) || [],
  };

  const parsed = experienceSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const { talentId } = await getOrCreateTalent();
  const supabase = await createClient();

  const { error } = await supabase.from("experience_blocks").insert({
    talent_id: talentId,
    block_type: parsed.data.blockType,
    title: parsed.data.title,
    company: parsed.data.company,
    location: parsed.data.location,
    start_date: parsed.data.startDate,
    end_date: parsed.data.isCurrent ? null : parsed.data.endDate,
    is_current: parsed.data.isCurrent,
    division: parsed.data.division,
    achievements: parsed.data.achievements,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/talent/onboarding/assessment-intro");
}

export async function completeOnboarding(): Promise<void> {
  const { talentId, userId } = await getOrCreateTalent();
  const supabase = await createClient();

  // Update talent profile completion
  await supabase
    .from("talents")
    .update({
      profile_completion_pct: 70, // Basic completion without assessment
      onboarding_completed: true,
    })
    .eq("id", talentId);

  // Update profile onboarding status
  await supabase
    .from("profiles")
    .update({
      onboarding_completed: true,
    })
    .eq("id", userId);

  // Trigger matching engine
  await generateMatchesForTalent(talentId);

  redirect("/talent/dashboard");
}
