import Link from "next/link";
import { Card, Text, Button } from "@/components/ui";

interface MissingItem {
  key: string;
  label: string;
  link: string;
}

interface ProfileCompletionProps {
  completionPct: number;
  hasAssessment: boolean;
  experienceBlockCount: number;
}

export function ProfileCompletion({
  completionPct,
  hasAssessment,
  experienceBlockCount,
}: ProfileCompletionProps) {
  const missingItems: MissingItem[] = [];

  if (!hasAssessment) {
    missingItems.push({
      key: "assessment",
      label: "Complete your assessment",
      link: "/talent/assessment",
    });
  }

  if (experienceBlockCount < 2) {
    missingItems.push({
      key: "experience",
      label: `Add ${2 - experienceBlockCount} more experience block${2 - experienceBlockCount > 1 ? "s" : ""}`,
      link: "/talent/profile#experience",
    });
  }

  return (
    <Card className="p-6">
      <Text variant="caption" className="uppercase tracking-wider text-soft-grey">
        Profile Completion
      </Text>

      <div className="mt-4">
        <div className="flex items-end gap-2">
          <span className="text-4xl font-serif font-semibold text-matte-gold">
            {completionPct}%
          </span>
        </div>

        <div className="mt-3 h-2 bg-concrete rounded-full overflow-hidden">
          <div
            className="h-full bg-matte-gold transition-all duration-500"
            style={{ width: `${completionPct}%` }}
          />
        </div>
      </div>

      {missingItems.length > 0 && (
        <div className="mt-6">
          <Text variant="caption" className="font-medium">
            To improve your profile:
          </Text>
          <ul className="mt-2 space-y-2">
            {missingItems.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.link}
                  className="flex items-center gap-2 text-sm text-soft-grey hover:text-charcoal transition-colors"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-matte-gold" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {completionPct < 100 && (
        <Link href="/talent/profile">
          <Button variant="secondary" size="sm" className="mt-4 w-full">
            Complete Profile
          </Button>
        </Link>
      )}
    </Card>
  );
}
