import Link from "next/link";
import { H2, Text } from "@/components/ui";

export default function BrandOnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-off-white">
      {/* Header */}
      <header className="border-b border-concrete bg-white">
        <div className="mx-auto max-w-3xl px-comfortable py-6">
          <Link href="/">
            <H2 className="text-center">Tailor Shift</H2>
          </Link>
          <Text variant="caption" className="mt-1 text-center text-soft-grey">
            Brand Onboarding
          </Text>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-2xl px-comfortable py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-concrete bg-white py-6">
        <Text variant="caption" className="text-center">
          Need help?{" "}
          <a href="mailto:support@tailorshift.com" className="underline hover:text-matte-gold">
            Contact support
          </a>
        </Text>
      </footer>
    </div>
  );
}
