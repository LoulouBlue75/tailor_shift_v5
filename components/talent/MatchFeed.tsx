import Link from "next/link";
import { Card, Text, Button, Badge } from "@/components/ui";

interface MatchData {
  id: string;
  score: number;
  opportunity: {
    id: string;
    title: string;
    brand_name?: string;
    city?: string;
  };
}

interface MatchFeedProps {
  matches: MatchData[];
}

export function MatchFeed({ matches }: MatchFeedProps) {
  if (!matches || matches.length === 0) {
    return (
      <Card className="p-6">
        <Text variant="caption" className="uppercase tracking-wider text-soft-grey">
          Opportunities for You
        </Text>

        <div className="mt-6 text-center py-8">
          <div className="h-16 w-16 mx-auto rounded-full bg-concrete/50 flex items-center justify-center">
            <svg
              className="h-8 w-8 text-soft-grey"
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
          </div>
          <Text className="mt-4 font-medium">No matches yet</Text>
          <Text variant="caption" className="mt-2 max-w-sm mx-auto">
            Complete your profile and assessment to unlock personalized opportunity matches.
          </Text>
          <Link href="/talent/profile">
            <Button variant="secondary" size="sm" className="mt-4">
              Complete Profile
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <Text variant="caption" className="uppercase tracking-wider text-soft-grey">
          Opportunities for You
        </Text>
        <Link
          href="/talent/opportunities"
          className="text-sm text-matte-gold hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="mt-6 space-y-4">
        {matches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </Card>
  );
}

function MatchCard({ match }: { match: MatchData }) {
  const scoreColor =
    match.score >= 80
      ? "bg-success/10 text-success"
      : match.score >= 60
        ? "bg-matte-gold/10 text-matte-gold"
        : "bg-concrete text-soft-grey";

  return (
    <Link href={`/talent/opportunities/${match.opportunity.id}`}>
      <div className="border border-concrete rounded-lg p-4 hover:border-matte-gold hover:shadow-sm transition-all cursor-pointer">
        <div className="flex items-start justify-between">
          <div>
            <Text className="font-medium">{match.opportunity.title}</Text>
            {match.opportunity.brand_name && (
              <Text variant="caption" className="mt-0.5">
                {match.opportunity.brand_name}
              </Text>
            )}
          </div>
          <span className={`text-xs font-medium px-2 py-1 rounded ${scoreColor}`}>
            {match.score}% match
          </span>
        </div>
        
        {match.opportunity.city && (
          <div className="mt-3 flex items-center gap-1 text-soft-grey">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <Text variant="caption">{match.opportunity.city}</Text>
          </div>
        )}
      </div>
    </Link>
  );
}
