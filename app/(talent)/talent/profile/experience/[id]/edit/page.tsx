import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui";
import { H1, Text } from "@/components/ui/Typography";
import { ExperienceBlockForm } from "@/components/talent";

export const metadata = {
  title: "Edit Experience | Tailor Shift",
  description: "Edit your professional experience block",
};

interface EditExperiencePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditExperiencePage({
  params,
}: EditExperiencePageProps) {
  const { id } = await params;
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

  // Get the experience block
  const { data: block } = await supabase
    .from("experience_blocks")
    .select("*")
    .eq("id", id)
    .eq("talent_id", talent.id)
    .single();

  if (!block) {
    notFound();
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
          <li className="text-charcoal">Edit</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <H1>Edit Experience</H1>
        <Text variant="body" className="mt-2 text-soft-grey">
          Update the details of your experience at {block.company}.
        </Text>
      </div>

      {/* Form */}
      <Card variant="default">
        <ExperienceBlockForm mode="edit" block={block} />
      </Card>
    </div>
  );
}
