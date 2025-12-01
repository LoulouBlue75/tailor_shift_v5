import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui";
import { H1, Text } from "@/components/ui/Typography";
import { ExperienceBlockForm } from "@/components/talent";

export const metadata = {
  title: "Add Experience | Tailor Shift",
  description: "Add a new professional experience block",
};

export default async function NewExperiencePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Verify talent exists
  const { data: talent } = await supabase
    .from("talents")
    .select("id")
    .eq("profile_id", user.id)
    .single();

  if (!talent) {
    redirect("/talent/onboarding");
  }

  return (
    <div className="mx-auto max-w-3xl px-comfortable py-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center gap-2 text-caption">
          <li>
            <Link
              href="/talent/profile/experience"
              className="text-soft-grey hover:text-charcoal transition-colors"
            >
              Experience
            </Link>
          </li>
          <li className="text-soft-grey">/</li>
          <li className="text-charcoal">Add New</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <H1>Add Experience</H1>
        <Text variant="body" className="mt-2 text-soft-grey">
          Add details about your professional experience in luxury retail.
          This information helps us match you with the right opportunities.
        </Text>
      </div>

      {/* Form */}
      <Card variant="default">
        <ExperienceBlockForm mode="create" />
      </Card>
    </div>
  );
}
