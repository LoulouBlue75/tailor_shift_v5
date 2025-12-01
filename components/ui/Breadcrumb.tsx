// Breadcrumb Navigation Component - Tailor Shift V5

import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("mb-6", className)}>
      <ol className="flex items-center gap-2 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-soft-grey hover:text-charcoal transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    isLast ? "text-charcoal font-medium" : "text-soft-grey"
                  )}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <svg
                  className="w-4 h-4 text-concrete"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// Pre-built breadcrumbs for common routes
export function TalentDashboardBreadcrumb() {
  return (
    <Breadcrumb
      items={[
        { label: "Dashboard", href: "/talent/dashboard" },
      ]}
    />
  );
}

export function TalentOpportunitiesBreadcrumb() {
  return (
    <Breadcrumb
      items={[
        { label: "Dashboard", href: "/talent/dashboard" },
        { label: "Opportunities" },
      ]}
    />
  );
}

export function TalentOpportunityDetailBreadcrumb({ title }: { title: string }) {
  return (
    <Breadcrumb
      items={[
        { label: "Dashboard", href: "/talent/dashboard" },
        { label: "Opportunities", href: "/talent/opportunities" },
        { label: title },
      ]}
    />
  );
}

export function TalentLearningBreadcrumb() {
  return (
    <Breadcrumb
      items={[
        { label: "Dashboard", href: "/talent/dashboard" },
        { label: "Learning" },
      ]}
    />
  );
}

export function TalentLearningModuleBreadcrumb({ title }: { title: string }) {
  return (
    <Breadcrumb
      items={[
        { label: "Dashboard", href: "/talent/dashboard" },
        { label: "Learning", href: "/talent/learning" },
        { label: title },
      ]}
    />
  );
}

export function BrandDashboardBreadcrumb() {
  return (
    <Breadcrumb
      items={[
        { label: "Dashboard", href: "/brand/dashboard" },
      ]}
    />
  );
}

export function BrandOpportunitiesBreadcrumb() {
  return (
    <Breadcrumb
      items={[
        { label: "Dashboard", href: "/brand/dashboard" },
        { label: "Opportunities" },
      ]}
    />
  );
}

export function BrandOpportunityDetailBreadcrumb({ title }: { title: string }) {
  return (
    <Breadcrumb
      items={[
        { label: "Dashboard", href: "/brand/dashboard" },
        { label: "Opportunities", href: "/brand/opportunities" },
        { label: title },
      ]}
    />
  );
}

export function BrandStoresBreadcrumb() {
  return (
    <Breadcrumb
      items={[
        { label: "Dashboard", href: "/brand/dashboard" },
        { label: "Stores" },
      ]}
    />
  );
}

export function BrandStoreDetailBreadcrumb({ name }: { name: string }) {
  return (
    <Breadcrumb
      items={[
        { label: "Dashboard", href: "/brand/dashboard" },
        { label: "Stores", href: "/brand/stores" },
        { label: name },
      ]}
    />
  );
}

export function BrandMatchesBreadcrumb({ opportunityTitle }: { opportunityTitle: string }) {
  return (
    <Breadcrumb
      items={[
        { label: "Dashboard", href: "/brand/dashboard" },
        { label: "Opportunities", href: "/brand/opportunities" },
        { label: opportunityTitle, href: "#" },
        { label: "Matches" },
      ]}
    />
  );
}
