"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { saveDivisions } from "@/app/actions/talent-onboarding";
import { Button, H3, Text, Stack, Card } from "@/components/ui";
import { StepProgress } from "@/components/onboarding/StepProgress";
import { DIVISION_OPTIONS } from "@/data/mcs";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending} className="w-full">
      Continue
    </Button>
  );
}

export default function DivisionsStep() {
  const [state, formAction] = useActionState(saveDivisions, null);

  return (
    <div>
      <StepProgress currentStep={4} totalSteps={7} stepName="Divisions Expertise" />
      
      <Card className="p-8">
        <H3>Your areas of expertise</H3>
        <Text variant="caption" className="mt-2">
          Select the product divisions you have experience in (1-5 maximum).
        </Text>

        <form action={formAction} className="mt-8">
          <Stack gap="lg">
            {state?.error && (
              <div className="rounded border border-error/20 bg-error/5 p-4 text-sm text-error">
                {state.error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              {DIVISION_OPTIONS.map((division) => (
                <label
                  key={division.value}
                  className="flex items-start gap-3 rounded border border-concrete p-4 cursor-pointer hover:border-matte-gold transition-colors has-[:checked]:border-matte-gold has-[:checked]:bg-matte-gold/5"
                >
                  <input
                    type="checkbox"
                    name="divisions"
                    value={division.value}
                    className="mt-1 h-4 w-4 rounded border-concrete text-matte-gold focus:ring-matte-gold"
                  />
                  <div>
                    <Text variant="body" className="font-medium">
                      {division.label}
                    </Text>
                    <Text variant="caption">{division.description}</Text>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex gap-4">
              <Link href="/talent/onboarding/professional" className="flex-1">
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
