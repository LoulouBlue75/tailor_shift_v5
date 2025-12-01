import Link from "next/link";
import { Card, Text, Button, Badge } from "@/components/ui";

interface AssessmentScore {
  service_excellence: number | null;
  clienteling: number | null;
  operations: number | null;
  leadership_signals: number | null;
}

interface AssessmentStatusProps {
  hasAssessment: boolean;
  scores?: AssessmentScore | null;
  completedAt?: string | null;
}

export function AssessmentStatus({
  hasAssessment,
  scores,
  completedAt,
}: AssessmentStatusProps) {
  if (!hasAssessment || !scores) {
    return (
      <Card className="p-6">
        <Text variant="caption" className="uppercase tracking-wider text-soft-grey">
          Assessment Status
        </Text>

        <div className="mt-4">
          <div className="h-12 w-12 rounded-full bg-matte-gold/10 flex items-center justify-center">
            <svg
              className="h-6 w-6 text-matte-gold"
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

          <Text className="mt-4 font-medium">
            Unlock Your Retail Excellence Profile
          </Text>
          <Text variant="caption" className="mt-2">
            Complete the 4D assessment to unlock personalized matches and learning recommendations.
          </Text>

          <Link href="/talent/assessment">
            <Button className="mt-4 w-full">Start Assessment</Button>
          </Link>
        </div>
      </Card>
    );
  }

  const dimensions = [
    { key: "service_excellence", label: "Service Excellence", score: scores.service_excellence },
    { key: "clienteling", label: "Clienteling", score: scores.clienteling },
    { key: "operations", label: "Operations", score: scores.operations },
    { key: "leadership_signals", label: "Leadership", score: scores.leadership_signals },
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <Text variant="caption" className="uppercase tracking-wider text-soft-grey">
          Retail Excellence Profile
        </Text>
        <Badge variant="success">Completed</Badge>
      </div>

      <div className="mt-6 space-y-4">
        {dimensions.map((dim) => (
          <div key={dim.key}>
            <div className="flex items-center justify-between mb-1">
              <Text variant="caption">{dim.label}</Text>
              <Text variant="caption" className="font-medium">
                {dim.score ? Math.round(dim.score * 20) : 0}/100
              </Text>
            </div>
            <div className="h-2 bg-concrete rounded-full overflow-hidden">
              <div
                className="h-full bg-matte-gold transition-all duration-500"
                style={{ width: `${dim.score ? dim.score * 20 : 0}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-2">
        <Link href="/talent/assessment/results" className="flex-1">
          <Button variant="secondary" size="sm" className="w-full">
            View Details
          </Button>
        </Link>
      </div>
    </Card>
  );
}
