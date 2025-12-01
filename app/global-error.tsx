// Global Error Boundary - Tailor Shift V5
// This catches errors in the root layout

"use client";

import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          {/* Error Icon */}
          <div className="mb-6">
            <svg
              className="w-20 h-20 mx-auto text-[#6B6B6B]"
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
          <h1
            className="text-3xl text-[#1A1A1A] mb-4"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Something went wrong
          </h1>
          <p className="text-[#6B6B6B] mb-8 text-lg">
            We encountered an unexpected error. Please try refreshing the page.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center px-6 py-3 bg-[#C2A878] text-[#1A1A1A] rounded font-medium hover:opacity-90 transition-opacity"
            >
              Try again
            </button>
            <button
              onClick={() => window.location.href = "/"}
              className="inline-flex items-center justify-center px-6 py-3 border border-[#1A1A1A] text-[#1A1A1A] rounded font-medium hover:bg-[#1A1A1A]/5 transition-colors"
            >
              Go to Home
            </button>
          </div>

          {/* Error Details (dev only) */}
          {process.env.NODE_ENV === "development" && error.message && (
            <details className="mt-8 text-left text-sm text-[#6B6B6B]">
              <summary className="cursor-pointer hover:text-[#1A1A1A]">
                Error details
              </summary>
              <pre className="mt-2 p-4 bg-[#E0E0DA]/30 rounded overflow-auto text-xs">
                {error.message}
                {error.stack && `\n\nStack:\n${error.stack}`}
                {error.digest && `\n\nDigest: ${error.digest}`}
              </pre>
            </details>
          )}
        </div>
      </body>
    </html>
  );
}
