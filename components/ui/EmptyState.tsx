// Empty State Component - Tailor Shift V5

import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
}

const buttonBaseStyles =
  "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-matte-gold focus:ring-offset-2 px-6 py-3 text-body rounded";

const primaryButtonStyles =
  "bg-matte-gold text-charcoal hover:bg-matte-gold/90";

const secondaryButtonStyles =
  "border border-charcoal text-charcoal bg-transparent hover:bg-charcoal/5";

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && (
        <div className="mb-4 text-soft-grey">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-charcoal mb-2">{title}</h3>
      <p className="text-soft-grey mb-6 max-w-md">{description}</p>
      <div className="flex flex-col sm:flex-row gap-3">
        {action && (
          <Link
            href={action.href}
            className={cn(buttonBaseStyles, primaryButtonStyles)}
          >
            {action.label}
          </Link>
        )}
        {secondaryAction && (
          <Link
            href={secondaryAction.href}
            className={cn(buttonBaseStyles, secondaryButtonStyles)}
          >
            {secondaryAction.label}
          </Link>
        )}
      </div>
    </div>
  );
}

// Pre-built empty states for common scenarios
export function NoOpportunitiesState() {
  return (
    <EmptyState
      icon={
        <svg
          className="w-16 h-16"
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
      }
      title="No opportunities yet"
      description="Create your first opportunity to start matching with qualified talent."
      action={{
        label: "Create Opportunity",
        href: "/brand/opportunities/new",
      }}
    />
  );
}

export function NoMatchesState() {
  return (
    <EmptyState
      icon={
        <svg
          className="w-16 h-16"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      }
      title="No matches found"
      description="Adjust your search criteria or check back later for new matches."
    />
  );
}

export function NoStoresState() {
  return (
    <EmptyState
      icon={
        <svg
          className="w-16 h-16"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      }
      title="No stores added"
      description="Add your first store to manage locations and create store-specific opportunities."
      action={{
        label: "Add Store",
        href: "/brand/stores/new",
      }}
    />
  );
}

export function NoExperienceState() {
  return (
    <EmptyState
      icon={
        <svg
          className="w-16 h-16"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      }
      title="No experience added"
      description="Add your work experience to improve your match score and showcase your background."
      action={{
        label: "Add Experience",
        href: "/talent/profile/experience",
      }}
    />
  );
}

export function NoLearningModulesState() {
  return (
    <EmptyState
      icon={
        <svg
          className="w-16 h-16"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      }
      title="No learning recommendations"
      description="Complete your assessment to get personalized learning recommendations."
      action={{
        label: "Take Assessment",
        href: "/talent/assessment",
      }}
    />
  );
}

export function NoResultsState({ query }: { query?: string }) {
  return (
    <EmptyState
      icon={
        <svg
          className="w-16 h-16"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      }
      title="No results found"
      description={
        query
          ? `No results found for "${query}". Try adjusting your search terms.`
          : "No results match your current filters. Try adjusting your criteria."
      }
    />
  );
}
