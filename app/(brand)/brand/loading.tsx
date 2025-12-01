// Loading State for Brand Routes - Tailor Shift V5

import { DashboardSkeleton } from "@/components/ui/Skeleton";

export default function BrandLoading() {
  return (
    <div className="animate-in fade-in duration-300">
      <DashboardSkeleton />
    </div>
  );
}
