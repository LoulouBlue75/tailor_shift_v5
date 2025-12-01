// Loading State for Talent Learning - Tailor Shift V5

import { LearningModuleSkeleton } from "@/components/ui/Skeleton";

export default function TalentLearningLoading() {
  return (
    <div className="animate-in fade-in duration-300">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="h-8 w-56 bg-concrete/60 rounded animate-pulse mb-2" />
        <div className="h-4 w-80 bg-concrete/60 rounded animate-pulse" />
      </div>

      {/* Learning Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <LearningModuleSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
