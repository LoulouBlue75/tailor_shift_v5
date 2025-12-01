import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, Badge } from "@/components/ui";
import { H1, H2, Text } from "@/components/ui/Typography";
import { ROLE_LEVELS } from "@/data/mcs/roles";
import { STORE_TIERS } from "@/data/mcs/tiers";
import { DIVISIONS } from "@/data/mcs/divisions";

export const metadata = {
  title: "Profile | Tailor Shift",
  description: "Manage your talent profile",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get talent data with experience blocks count
  const { data: talent } = await supabase
    .from("talents")
    .select("*")
    .eq("profile_id", user.id)
    .single();

  if (!talent) {
    redirect("/talent/onboarding");
  }

  // Get experience blocks count
  const { count: experienceCount } = await supabase
    .from("experience_blocks")
    .select("*", { count: "exact", head: true })
    .eq("talent_id", talent.id);

  const roleLevel = talent.current_role_level
    ? ROLE_LEVELS[talent.current_role_level as keyof typeof ROLE_LEVELS]
    : null;
  const storeTier = talent.current_store_tier
    ? STORE_TIERS[talent.current_store_tier as keyof typeof STORE_TIERS]
    : null;

  return (
    <div className="mx-auto max-w-4xl px-comfortable py-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <H1>Profile</H1>
          <Text variant="body" className="mt-1 text-soft-grey">
            Manage your professional profile and experience
          </Text>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={talent.profile_completion_pct >= 80 ? "success" : "warning"}
          >
            {talent.profile_completion_pct}% Complete
          </Badge>
        </div>
      </div>

      {/* Profile Overview Card */}
      <Card variant="default" className="mt-8">
        <div className="flex flex-col sm:flex-row sm:items-start gap-6">
          {/* Avatar Placeholder */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 rounded-full bg-matte-gold/10 flex items-center justify-center">
              <span className="text-2xl font-semibold text-matte-gold">
                {talent.first_name?.[0]}
                {talent.last_name?.[0]}
              </span>
            </div>
          </div>

          {/* Basic Info */}
          <div className="flex-1">
            <H2>
              {talent.first_name} {talent.last_name}
            </H2>
            {roleLevel && (
              <Text variant="body" className="mt-1 text-charcoal">
                {roleLevel.name}
                {storeTier && ` at ${storeTier.name} store`}
              </Text>
            )}
            {talent.current_maison && (
              <Text variant="caption" className="mt-1 text-soft-grey">
                {talent.current_maison}
                {talent.current_location && ` • ${talent.current_location}`}
              </Text>
            )}
            {talent.years_in_luxury !== null && (
              <Text variant="caption" className="mt-2 text-soft-grey">
                {talent.years_in_luxury} years in luxury retail
              </Text>
            )}
          </div>
        </div>

        {/* Divisions */}
        {talent.divisions_expertise && talent.divisions_expertise.length > 0 && (
          <div className="mt-6 pt-6 border-t border-concrete">
            <Text variant="label" className="text-charcoal mb-3">
              Divisions Expertise
            </Text>
            <div className="flex flex-wrap gap-2">
              {talent.divisions_expertise.map((divCode: string) => {
                const division = DIVISIONS[divCode as keyof typeof DIVISIONS];
                return division ? (
                  <Badge key={divCode} variant="default" size="sm">
                    {division.name}
                  </Badge>
                ) : null;
              })}
            </div>
          </div>
        )}
      </Card>

      {/* Profile Sections */}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {/* Experience Section */}
        <Link href="/talent/profile/experience" className="block">
          <Card variant="interactive" className="h-full">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-matte-gold/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-matte-gold"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <Text variant="label" className="text-charcoal">
                    Experience
                  </Text>
                  <Text variant="caption" className="text-soft-grey">
                    {experienceCount || 0} experience blocks
                  </Text>
                </div>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-soft-grey"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <Text variant="caption" className="mt-3 text-soft-grey">
              Manage your professional experience blocks to improve matching.
            </Text>
          </Card>
        </Link>

        {/* Assessment Section */}
        <Card variant="default" className="h-full opacity-75">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-concrete">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-soft-grey"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <Text variant="label" className="text-charcoal">
                  Assessment
                </Text>
                <Text variant="caption" className="text-soft-grey">
                  Not completed
                </Text>
              </div>
            </div>
            <Badge variant="default" size="sm">
              Coming Soon
            </Badge>
          </div>
          <Text variant="caption" className="mt-3 text-soft-grey">
            Complete the luxury retail assessment to unlock better matches.
          </Text>
        </Card>

        {/* Preferences Section */}
        <Card variant="default" className="h-full opacity-75">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-concrete">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-soft-grey"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <Text variant="label" className="text-charcoal">
                  Preferences
                </Text>
                <Text variant="caption" className="text-soft-grey">
                  Career goals & preferences
                </Text>
              </div>
            </div>
            <Badge variant="default" size="sm">
              Coming Soon
            </Badge>
          </div>
          <Text variant="caption" className="mt-3 text-soft-grey">
            Update your career preferences and job search settings.
          </Text>
        </Card>

        {/* Settings Section */}
        <Card variant="default" className="h-full opacity-75">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-concrete">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-soft-grey"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <Text variant="label" className="text-charcoal">
                  Account Settings
                </Text>
                <Text variant="caption" className="text-soft-grey">
                  Email, password & notifications
                </Text>
              </div>
            </div>
            <Badge variant="default" size="sm">
              Coming Soon
            </Badge>
          </div>
          <Text variant="caption" className="mt-3 text-soft-grey">
            Manage your account settings and notification preferences.
          </Text>
        </Card>
      </div>
    </div>
  );
}
