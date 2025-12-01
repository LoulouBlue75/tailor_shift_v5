// Global 404 Not Found Page - Tailor Shift V5

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-off-white">
      <div className="text-center max-w-md">
        {/* 404 Illustration */}
        <div className="mb-8">
          <svg
            className="w-32 h-32 mx-auto text-concrete"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Error Message */}
        <h1 className="text-4xl font-playfair text-charcoal mb-4">
          Page Not Found
        </h1>
        <p className="text-soft-grey mb-8 text-lg">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Navigation Options */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-matte-gold text-charcoal rounded font-medium hover:bg-matte-gold/90 transition-colors"
          >
            Go to Home
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-6 py-3 border border-charcoal text-charcoal rounded font-medium hover:bg-charcoal/5 transition-colors"
          >
            Sign In
          </Link>
        </div>

        {/* Help Link */}
        <p className="mt-8 text-sm text-soft-grey">
          Need help?{" "}
          <a
            href="mailto:support@tailorshift.com"
            className="text-charcoal underline underline-offset-4 hover:text-matte-gold"
          >
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
}
