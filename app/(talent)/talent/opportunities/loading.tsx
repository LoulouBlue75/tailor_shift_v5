// Loading State for Talent Opportunities - Tailor Shift V5

import { OpportunityCardSkeleton } from "@/components/ui/Skeleton";

export default function TalentOpportunitiesLoading() {
  return (
    <div className="animate-in fade-in duration-300">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="h-8 w-48 bg-concrete/60 rounded animate-pulse mb-2" />
        <div className="h-4 w-96 bg-concrete/60 rounded animate-pulse" />
      </div>

      {/* Opportunity Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <OpportunityCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
