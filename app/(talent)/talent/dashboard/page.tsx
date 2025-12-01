import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { H2, Text, Stack } from "@/components/ui";
import {
  ProfileCompletion,
  AssessmentStatus,
  MatchFeed,
  LearningRecommendations,
  CareerProjection,
} from "@/components/talent";
import type { RoleLevelCode } from "@/data/mcs";

export default async function TalentDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch talent data with experience blocks count
  const { data: talent } = await supabase
    .from("talents")
    .select(`
      id,
      first_name,
      last_name,
      current_role_level,
      profile_completion_pct,
      assessment_summary,
      years_in_luxury
    `)
    .eq("profile_id", user.id)
    .single();

  // If no talent record, redirect to onboarding
  if (!talent) {
    redirect("/talent/onboarding");
  }

  // Get experience blocks count
  const { count: experienceBlockCount } = await supabase
    .from("experience_blocks")
    .select("id", { count: "exact", head: true })
    .eq("talent_id", talent.id);

  // Check if assessment is completed
  const assessmentSummary = talent.assessment_summary as {
    service_excellence: number | null;
    clienteling: number | null;
    operations: number | null;
    leadership_signals: number | null;
    completed_at: string | null;
  } | null;
  
  const hasAssessment = !!(assessmentSummary?.completed_at);

  // Fetch matches (top 5 by score)
  const { data: matchesRaw } = await supabase
    .from("matches")
    .select(`
      id,
      score,
      opportunity_id,
      opportunities (
        id,
        title,
        brands (name),
        stores (city)
      )
    `)
    .eq("talent_id", talent.id)
    .order("score", { ascending: false })
    .limit(5);

  // Transform matches data
  const matches = (matchesRaw || []).map((m) => {
    const match = m as {
      id: string;
      score: number;
      opportunity_id: string;
      opportunities?: {
        id?: string;
        title?: string;
        brands?: { name?: string }[];
        stores?: { city?: string }[];
      }[];
    };
    const opp = match.opportunities?.[0];
    return {
      id: match.id,
      score: match.score,
      opportunity: {
        id: opp?.id || match.opportunity_id,
        title: opp?.title || "Opportunity",
        brand_name: opp?.brands?.[0]?.name,
        city: opp?.stores?.[0]?.city,
      },
    };
  });

  // Fetch recommended learning modules
  const { data: learningModules } = await supabase
    .from("learning_modules")
    .select(`
      id,
      title,
      duration_minutes,
      difficulty,
      category
    `)
    .eq("status", "active")
    .order("sort_order", { ascending: true })
    .limit(3);

  return (
    <div className="mx-auto max-w-7xl px-comfortable py-8">
      <Stack gap="xl">
        {/* Welcome Section */}
        <div>
          <H2>Welcome back, {talent.first_name}! 👋</H2>
          <Text className="mt-2">
            Your luxury retail career journey starts here.
          </Text>
        </div>

        {/* Top Row: Profile Completion + Assessment Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfileCompletion
            completionPct={talent.profile_completion_pct || 0}
            hasAssessment={hasAssessment}
            experienceBlockCount={experienceBlockCount || 0}
          />
          <AssessmentStatus
            hasAssessment={hasAssessment}
            scores={assessmentSummary}
            completedAt={assessmentSummary?.completed_at}
          />
        </div>

        {/* Match Feed */}
        <MatchFeed matches={matches} />

        {/* Bottom Row: Learning + Career */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LearningRecommendations
            modules={(learningModules || []).map((m) => {
              const mod = m as {
                id: string;
                title: string;
                duration_minutes: number | null;
                difficulty: "beginner" | "intermediate" | "advanced";
                category: string;
              };
              return {
                id: mod.id,
                title: mod.title,
                duration_minutes: mod.duration_minutes,
                difficulty: mod.difficulty,
                category: mod.category,
              };
            })}
          />
          <CareerProjection talent={talent} />
        </div>
      </Stack>
    </div>
  );
}
