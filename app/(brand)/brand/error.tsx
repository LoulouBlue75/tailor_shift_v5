// Error Boundary for Brand Routes - Tailor Shift V5

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function BrandError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Brand route error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Error Icon */}
        <div className="mb-6">
          <svg
            className="w-16 h-16 mx-auto text-soft-grey"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Error Message */}
        <h1 className="text-2xl font-playfair text-charcoal mb-4">
          Something went wrong
        </h1>
        <p className="text-soft-grey mb-8">
          We encountered an unexpected error. Please try again or return to your
          dashboard.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset}>Try again</Button>
          <Link
            href="/brand/dashboard"
            className="inline-flex items-center justify-center px-6 py-3 border border-charcoal text-charcoal rounded font-medium hover:bg-charcoal/5 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Error Details (dev only) */}
        {process.env.NODE_ENV === "development" && error.message && (
          <details className="mt-8 text-left text-sm text-soft-grey">
            <summary className="cursor-pointer hover:text-charcoal">
              Error details
            </summary>
            <pre className="mt-2 p-4 bg-concrete/30 rounded overflow-auto">
              {error.message}
              {error.digest && `\n\nDigest: ${error.digest}`}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
