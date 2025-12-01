import Link from "next/link";
import { Card, Text, Button, Badge } from "@/components/ui";

interface LearningModule {
  id: string;
  title: string;
  duration_minutes: number | null;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: string;
  progress_pct?: number;
}

interface LearningRecommendationsProps {
  modules: LearningModule[];
}

export function LearningRecommendations({ modules }: LearningRecommendationsProps) {
  const difficultyColors = {
    beginner: "bg-success/10 text-success",
    intermediate: "bg-matte-gold/10 text-matte-gold",
    advanced: "bg-error/10 text-error",
  };

  if (!modules || modules.length === 0) {
    return (
      <Card className="p-6">
        <Text variant="caption" className="uppercase tracking-wider text-soft-grey">
          Recommended Learning
        </Text>

        <div className="mt-6 text-center py-6">
          <Text className="font-medium">Loading recommendations...</Text>
          <Text variant="caption" className="mt-2">
            Complete your assessment to get personalized learning paths.
          </Text>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <Text variant="caption" className="uppercase tracking-wider text-soft-grey">
          Recommended Learning
        </Text>
        <Link
          href="/talent/learning"
          className="text-sm text-matte-gold hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {modules.slice(0, 3).map((module) => (
          <Link key={module.id} href={`/talent/learning/${module.id}`}>
            <div className="p-4 rounded border border-concrete hover:border-matte-gold hover:shadow-sm transition-all cursor-pointer">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <Text className="font-medium truncate">{module.title}</Text>
                  <div className="mt-2 flex items-center gap-3">
                    {module.duration_minutes && (
                      <Text variant="caption" className="text-soft-grey">
                        {module.duration_minutes} min
                      </Text>
                    )}
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${difficultyColors[module.difficulty]}`}
                    >
                      {module.difficulty}
                    </span>
                  </div>
                </div>
                {module.progress_pct !== undefined && module.progress_pct > 0 && (
                  <div className="text-right">
                    <Text variant="caption" className="text-matte-gold">
                      {module.progress_pct}%
                    </Text>
                  </div>
                )}
              </div>
              
              {module.progress_pct !== undefined && module.progress_pct > 0 && (
                <div className="mt-3 h-1 bg-concrete rounded-full overflow-hidden">
                  <div
                    className="h-full bg-matte-gold"
                    style={{ width: `${module.progress_pct}%` }}
                  />
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      <Link href="/talent/learning">
        <Button variant="secondary" size="sm" className="mt-4 w-full">
          Browse All Modules
        </Button>
      </Link>
    </Card>
  );
}
