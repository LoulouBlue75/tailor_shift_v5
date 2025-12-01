"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import type {
  RoleLevel,
  StoreTier,
  Division,
  ExperienceBlockType,
  BrandSegment,
} from "@/lib/supabase/database.types";

// ============================================================================
// SCHEMAS
// ============================================================================

const experienceBlockSchema = z
  .object({
    blockType: z.enum([
      "foh",
      "boh",
      "leadership",
      "clienteling",
      "operations",
      "business",
    ]),
    title: z.string().min(2, "Title must be at least 2 characters").max(200),
    company: z.string().min(1, "Maison/Company is required"),
    brandSegment: z
      .enum(["ultra_luxury", "luxury", "premium", "accessible_luxury"])
      .optional()
      .nullable(),
    location: z.string().optional().nullable(),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional().nullable(),
    isCurrent: z.boolean().default(false),
    roleLevel: z
      .enum(["L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8"])
      .optional()
      .nullable(),
    storeTier: z.enum(["T1", "T2", "T3", "T4", "T5"]).optional().nullable(),
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
      .optional()
      .nullable(),
    description: z.string().max(500).optional().nullable(),
    achievements: z.array(z.string()).max(5).default([]),
    responsibilities: z.array(z.string()).default([]),
  })
  .refine(
    (data) => {
      // If not current, end date required
      if (!data.isCurrent && !data.endDate) {
        return false;
      }
      return true;
    },
    { message: "End date is required if not current position", path: ["endDate"] }
  )
  .refine(
    (data) => {
      // Start date cannot be in the future
      const startDate = new Date(data.startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return startDate <= today;
    },
    { message: "Start date cannot be in the future", path: ["startDate"] }
  )
  .refine(
    (data) => {
      // End date cannot be before start date
      if (data.endDate) {
        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);
        return endDate >= startDate;
      }
      return true;
    },
    { message: "End date cannot be before start date", path: ["endDate"] }
  );

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function getTalentId(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const { data: talent } = await supabase
    .from("talents")
    .select("id")
    .eq("profile_id", user.id)
    .single();

  if (!talent) {
    throw new Error("Talent profile not found");
  }

  return talent.id;
}

async function verifyBlockOwnership(
  blockId: string,
  talentId: string
): Promise<boolean> {
  const supabase = await createClient();
  const { data: block } = await supabase
    .from("experience_blocks")
    .select("talent_id")
    .eq("id", blockId)
    .single();

  return block?.talent_id === talentId;
}

export async function updateProfileCompletion(talentId: string): Promise<void> {
  const supabase = await createClient();

  // Get talent with experience blocks count
  const { data: talent } = await supabase
    .from("talents")
    .select(
      `
      first_name,
      last_name,
      current_role_level,
      divisions_expertise,
      career_preferences,
      assessment_summary
    `
    )
    .eq("id", talentId)
    .single();

  // Get experience blocks count
  const { count: blocksCount } = await supabase
    .from("experience_blocks")
    .select("*", { count: "exact", head: true })
    .eq("talent_id", talentId);

  // Calculate completion percentage
  let completion = 0;

  // Basic info (20%)
  if (talent?.first_name && talent?.last_name) completion += 20;

  // Professional info (20%)
  if (talent?.current_role_level) completion += 20;

  // Divisions (10%)
  if (talent?.divisions_expertise && talent.divisions_expertise.length > 0)
    completion += 10;

  // Career preferences (10%)
  const prefs = talent?.career_preferences as Record<string, unknown> | null;
  if (prefs && prefs.target_role_levels) completion += 10;

  // Experience blocks (20%)
  if (blocksCount && blocksCount > 0) {
    completion += Math.min(20, blocksCount * 10); // 10% per block, max 20%
  }

  // Assessment (20%)
  const assessment = talent?.assessment_summary as Record<string, unknown> | null;
  if (assessment?.completed_at) completion += 20;

  // Update talent profile completion
  await supabase
    .from("talents")
    .update({ profile_completion_pct: completion })
    .eq("id", talentId);
}

// ============================================================================
// SERVER ACTIONS
// ============================================================================

type ActionState = { error?: string; success?: boolean } | null;

export async function getExperienceBlocks() {
  const talentId = await getTalentId();
  const supabase = await createClient();

  const { data: blocks, error } = await supabase
    .from("experience_blocks")
    .select("*")
    .eq("talent_id", talentId)
    .order("start_date", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return blocks;
}

export async function getExperienceBlock(id: string) {
  const talentId = await getTalentId();
  const supabase = await createClient();

  const { data: block, error } = await supabase
    .from("experience_blocks")
    .select("*")
    .eq("id", id)
    .eq("talent_id", talentId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return block;
}

export async function createExperienceBlock(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const talentId = await getTalentId();
    const supabase = await createClient();

    // Parse achievements from JSON string
    let achievements: string[] = [];
    const achievementsStr = formData.get("achievements") as string;
    if (achievementsStr) {
      try {
        achievements = JSON.parse(achievementsStr);
      } catch {
        // If not JSON, try splitting by newlines
        achievements = achievementsStr.split("\n").filter(Boolean);
      }
    }

    // Parse responsibilities from JSON string
    let responsibilities: string[] = [];
    const responsibilitiesStr = formData.get("responsibilities") as string;
    if (responsibilitiesStr) {
      try {
        responsibilities = JSON.parse(responsibilitiesStr);
      } catch {
        responsibilities = responsibilitiesStr.split("\n").filter(Boolean);
      }
    }

    const rawData = {
      blockType: formData.get("blockType") as ExperienceBlockType,
      title: formData.get("title") as string,
      company: formData.get("company") as string,
      brandSegment: (formData.get("brandSegment") as BrandSegment) || null,
      location: (formData.get("location") as string) || null,
      startDate: formData.get("startDate") as string,
      endDate:
        formData.get("isCurrent") === "true"
          ? null
          : (formData.get("endDate") as string) || null,
      isCurrent: formData.get("isCurrent") === "true",
      roleLevel: (formData.get("roleLevel") as RoleLevel) || null,
      storeTier: (formData.get("storeTier") as StoreTier) || null,
      division: (formData.get("division") as Division) || null,
      description: (formData.get("description") as string) || null,
      achievements,
      responsibilities,
    };

    const parsed = experienceBlockSchema.safeParse(rawData);
    if (!parsed.success) {
      return { error: parsed.error.errors[0].message };
    }

    const { error } = await supabase.from("experience_blocks").insert({
      talent_id: talentId,
      block_type: parsed.data.blockType,
      title: parsed.data.title,
      company: parsed.data.company,
      brand_segment: parsed.data.brandSegment,
      location: parsed.data.location,
      start_date: parsed.data.startDate,
      end_date: parsed.data.endDate,
      is_current: parsed.data.isCurrent,
      division: parsed.data.division,
      store_tier: parsed.data.storeTier,
      responsibilities: parsed.data.responsibilities,
      achievements: parsed.data.achievements,
    });

    if (error) {
      return { error: error.message };
    }

    // Update profile completion
    await updateProfileCompletion(talentId);

    revalidatePath("/talent/profile/experience");
  } catch (err) {
    return { error: err instanceof Error ? err.message : "An error occurred" };
  }

  redirect("/talent/profile/experience");
}

export async function updateExperienceBlock(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const talentId = await getTalentId();
    const supabase = await createClient();

    // Verify ownership
    const isOwner = await verifyBlockOwnership(id, talentId);
    if (!isOwner) {
      return { error: "Unauthorized" };
    }

    // Parse achievements from JSON string
    let achievements: string[] = [];
    const achievementsStr = formData.get("achievements") as string;
    if (achievementsStr) {
      try {
        achievements = JSON.parse(achievementsStr);
      } catch {
        achievements = achievementsStr.split("\n").filter(Boolean);
      }
    }

    // Parse responsibilities from JSON string
    let responsibilities: string[] = [];
    const responsibilitiesStr = formData.get("responsibilities") as string;
    if (responsibilitiesStr) {
      try {
        responsibilities = JSON.parse(responsibilitiesStr);
      } catch {
        responsibilities = responsibilitiesStr.split("\n").filter(Boolean);
      }
    }

    const rawData = {
      blockType: formData.get("blockType") as ExperienceBlockType,
      title: formData.get("title") as string,
      company: formData.get("company") as string,
      brandSegment: (formData.get("brandSegment") as BrandSegment) || null,
      location: (formData.get("location") as string) || null,
      startDate: formData.get("startDate") as string,
      endDate:
        formData.get("isCurrent") === "true"
          ? null
          : (formData.get("endDate") as string) || null,
      isCurrent: formData.get("isCurrent") === "true",
      roleLevel: (formData.get("roleLevel") as RoleLevel) || null,
      storeTier: (formData.get("storeTier") as StoreTier) || null,
      division: (formData.get("division") as Division) || null,
      description: (formData.get("description") as string) || null,
      achievements,
      responsibilities,
    };

    const parsed = experienceBlockSchema.safeParse(rawData);
    if (!parsed.success) {
      return { error: parsed.error.errors[0].message };
    }

    const { error } = await supabase
      .from("experience_blocks")
      .update({
        block_type: parsed.data.blockType,
        title: parsed.data.title,
        company: parsed.data.company,
        brand_segment: parsed.data.brandSegment,
        location: parsed.data.location,
        start_date: parsed.data.startDate,
        end_date: parsed.data.endDate,
        is_current: parsed.data.isCurrent,
        division: parsed.data.division,
        store_tier: parsed.data.storeTier,
        responsibilities: parsed.data.responsibilities,
        achievements: parsed.data.achievements,
      })
      .eq("id", id);

    if (error) {
      return { error: error.message };
    }

    // Update profile completion
    await updateProfileCompletion(talentId);

    revalidatePath("/talent/profile/experience");
  } catch (err) {
    return { error: err instanceof Error ? err.message : "An error occurred" };
  }

  redirect("/talent/profile/experience");
}

export async function deleteExperienceBlock(id: string): Promise<ActionState> {
  try {
    const talentId = await getTalentId();
    const supabase = await createClient();

    // Verify ownership
    const isOwner = await verifyBlockOwnership(id, talentId);
    if (!isOwner) {
      return { error: "Unauthorized" };
    }

    const { error } = await supabase
      .from("experience_blocks")
      .delete()
      .eq("id", id);

    if (error) {
      return { error: error.message };
    }

    // Update profile completion
    await updateProfileCompletion(talentId);

    revalidatePath("/talent/profile/experience");
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "An error occurred" };
  }
}
