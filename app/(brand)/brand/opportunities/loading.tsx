// Loading State for Brand Opportunities - Tailor Shift V5

import { OpportunityCardSkeleton } from "@/components/ui/Skeleton";

export default function BrandOpportunitiesLoading() {
  return (
    <div className="animate-in fade-in duration-300">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="h-8 w-48 bg-concrete/60 rounded animate-pulse mb-2" />
          <div className="h-4 w-72 bg-concrete/60 rounded animate-pulse" />
        </div>
        <div className="h-10 w-40 bg-concrete/60 rounded animate-pulse" />
      </div>

      {/* Opportunity Cards */}
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <OpportunityCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
