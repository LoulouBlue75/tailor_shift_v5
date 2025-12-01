"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, H1, H3, Text, Stack } from "@/components/ui";
import { BrandStepProgress } from "@/components/onboarding/BrandStepProgress";
import { completeBrandOnboarding } from "@/app/actions/brand-onboarding";

export default function OpportunityIntroPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCreateOpportunity = async () => {
    setLoading(true);
    await completeBrandOnboarding();
    router.push("/brand/opportunities/new");
  };

  const handleSkip = async () => {
    setLoading(true);
    await completeBrandOnboarding();
    router.push("/brand/dashboard");
  };

  return (
    <div>
      <BrandStepProgress currentStep={5} />

      <Card className="p-8 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-matte-gold/10">
          <span className="text-4xl">🚀</span>
        </div>

        <H1 className="mt-6">Ready to Post Your First Opportunity?</H1>
        <Text className="mt-4 text-soft-grey max-w-md mx-auto">
          Start attracting top talent by creating your first job opportunity. 
          Our 7D matching algorithm will help you find the perfect candidates.
        </Text>

        <Stack gap="md" className="mt-8 max-w-sm mx-auto">
          {/* Benefits */}
          <div className="text-left p-4 rounded bg-off-white">
            <H3 className="text-center mb-4">What you&apos;ll get:</H3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-matte-gold mt-0.5">✓</span>
                <div>
                  <Text className="font-medium">Access to Top Talent</Text>
                  <Text variant="caption" className="text-soft-grey">
                    Connect with pre-vetted luxury retail professionals
                  </Text>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-matte-gold mt-0.5">✓</span>
                <div>
                  <Text className="font-medium">7D Matching Algorithm</Text>
                  <Text variant="caption" className="text-soft-grey">
                    Smart matching across 7 dimensions for perfect fit
                  </Text>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-matte-gold mt-0.5">✓</span>
                <div>
                  <Text className="font-medium">Skill-Based Assessment</Text>
                  <Text variant="caption" className="text-soft-grey">
                    Candidates scored on service, clienteling & leadership
                  </Text>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-matte-gold mt-0.5">✓</span>
                <div>
                  <Text className="font-medium">Real-Time Updates</Text>
                  <Text variant="caption" className="text-soft-grey">
                    Get notified when matches show interest
                  </Text>
                </div>
              </li>
            </ul>
          </div>
        </Stack>

        <div className="mt-8 space-y-4">
          <Button
            onClick={handleCreateOpportunity}
            loading={loading}
            className="w-full max-w-sm mx-auto"
          >
            Create Your First Opportunity
          </Button>
          <button
            onClick={handleSkip}
            disabled={loading}
            className="block w-full text-caption text-soft-grey hover:text-charcoal transition-colors disabled:opacity-50"
          >
            Skip for now → Go to Dashboard
          </button>
        </div>
      </Card>
    </div>
  );
}
