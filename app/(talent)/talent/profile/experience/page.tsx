import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button, Card } from "@/components/ui";
import { H1, Text } from "@/components/ui/Typography";
import { ExperienceBlockCard } from "@/components/talent";

export const metadata = {
  title: "Experience | Tailor Shift",
  description: "Manage your professional experience blocks",
};

export default async function ExperiencePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get talent ID
  const { data: talent } = await supabase
    .from("talents")
    .select("id")
    .eq("profile_id", user.id)
    .single();

  if (!talent) {
    redirect("/talent/onboarding");
  }

  // Get experience blocks
  const { data: blocks } = await supabase
    .from("experience_blocks")
    .select("*")
    .eq("talent_id", talent.id)
    .order("start_date", { ascending: false });

  return (
    <div className="mx-auto max-w-4xl px-comfortable py-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <H1>Experience</H1>
          <Text variant="body" className="mt-1 text-soft-grey">
            Manage your professional experience blocks
          </Text>
        </div>
        <Link href="/talent/profile/experience/new">
          <Button variant="primary">Add Experience</Button>
        </Link>
      </div>

      {/* Experience Blocks List */}
      {blocks && blocks.length > 0 ? (
        <div className="mt-8 space-y-4">
          {blocks.map((block) => (
            <ExperienceBlockCard key={block.id} block={block} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <Card variant="default" className="mt-8 text-center py-12">
          <div className="mx-auto max-w-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto h-12 w-12 text-soft-grey"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <Text variant="body" className="mt-4 text-charcoal font-medium">
              No experience blocks yet
            </Text>
            <Text variant="caption" className="mt-2 text-soft-grey">
              Add your professional experience to build a structured CV for better matching with opportunities.
            </Text>
            <Link href="/talent/profile/experience/new">
              <Button variant="primary" className="mt-6">
                Add Your First Role
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Info Card */}
      <Card variant="default" className="mt-8 bg-matte-gold/5 border-matte-gold/20">
        <div className="flex gap-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-matte-gold flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <Text variant="label" className="text-charcoal">
              Why add experience blocks?
            </Text>
            <Text variant="caption" className="mt-1 text-soft-grey">
              Experience blocks help our matching algorithm understand your professional background.
              The more detailed your experience, the better we can match you with relevant opportunities.
              Include achievements to stand out to luxury brands.
            </Text>
          </div>
        </div>
      </Card>
    </div>
  );
}
