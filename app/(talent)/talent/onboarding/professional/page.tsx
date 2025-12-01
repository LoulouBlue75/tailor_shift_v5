"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { saveProfessional } from "@/app/actions/talent-onboarding";
import { Button, Input, H3, Text, Stack, Card } from "@/components/ui";
import { StepProgress } from "@/components/onboarding/StepProgress";
import { ROLE_LEVEL_OPTIONS, STORE_TIER_OPTIONS } from "@/data/mcs";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending} className="w-full">
      Continue
    </Button>
  );
}

export default function ProfessionalStep() {
  const [state, formAction] = useActionState(saveProfessional, null);

  return (
    <div>
      <StepProgress currentStep={3} totalSteps={7} stepName="Professional Identity" />
      
      <Card className="p-8">
        <H3>Your professional profile</H3>
        <Text variant="caption" className="mt-2">
          Tell us about your current position in luxury retail.
        </Text>

        <form action={formAction} className="mt-8">
          <Stack gap="lg">
            {state?.error && (
              <div className="rounded border border-error/20 bg-error/5 p-4 text-sm text-error">
                {state.error}
              </div>
            )}

            <div>
              <label className="block text-label font-medium text-charcoal">
                Current Role Level <span className="text-error">*</span>
              </label>
              <select
                name="currentRoleLevel"
                required
                className="mt-2 block w-full rounded border border-concrete bg-white px-4 py-3 text-body text-charcoal focus:border-matte-gold focus:outline-none focus:ring-1 focus:ring-matte-gold"
              >
                <option value="">Select your role level</option>
                {ROLE_LEVEL_OPTIONS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-label font-medium text-charcoal">
                Current Store Tier <span className="text-error">*</span>
              </label>
              <select
                name="currentStoreTier"
                required
                className="mt-2 block w-full rounded border border-concrete bg-white px-4 py-3 text-body text-charcoal focus:border-matte-gold focus:outline-none focus:ring-1 focus:ring-matte-gold"
              >
                <option value="">Select store tier</option>
                {STORE_TIER_OPTIONS.map((tier) => (
                  <option key={tier.value} value={tier.value}>
                    {tier.label}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Years in Luxury Retail"
              name="yearsInLuxury"
              type="number"
              min={0}
              max={50}
              required
              placeholder="5"
            />

            <Input
              label="Current Maison"
              name="currentMaison"
              type="text"
              placeholder="e.g., Louis Vuitton, Chanel, Gucci"
              helperText="Optional"
            />

            <Input
              label="Current Location"
              name="currentLocation"
              type="text"
              placeholder="e.g., Paris, London, New York"
              helperText="Optional"
            />

            <div className="flex gap-4">
              <Link href="/talent/onboarding/identity" className="flex-1">
                <Button type="button" variant="secondary" className="w-full">
                  Previous
                </Button>
              </Link>
              <div className="flex-1">
                <SubmitButton />
              </div>
            </div>
          </Stack>
        </form>
      </Card>
    </div>
  );
}
