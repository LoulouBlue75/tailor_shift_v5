"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { savePreferences } from "@/app/actions/talent-onboarding";
import { Button, Input, H3, Text, Stack, Card } from "@/components/ui";
import { StepProgress } from "@/components/onboarding/StepProgress";
import { ROLE_LEVEL_OPTIONS, STORE_TIER_OPTIONS, DIVISION_OPTIONS, MOBILITY_OPTIONS, TIMELINE_OPTIONS } from "@/data/mcs";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending} className="w-full">
      Continue
    </Button>
  );
}

export default function PreferencesStep() {
  const [state, formAction] = useActionState(savePreferences, null);

  return (
    <div>
      <StepProgress currentStep={5} totalSteps={7} stepName="Career Preferences" />
      
      <Card className="p-8">
        <H3>Your career aspirations</H3>
        <Text variant="caption" className="mt-2">
          Help us match you with the right opportunities.
        </Text>

        <form action={formAction} className="mt-8">
          <Stack gap="lg">
            {state?.error && (
              <div className="rounded border border-error/20 bg-error/5 p-4 text-sm text-error">
                {state.error}
              </div>
            )}

            {/* Target Role Levels */}
            <div>
              <Text variant="label">Target Role Levels <span className="text-error">*</span></Text>
              <Text variant="caption" className="mt-1">Select roles you're interested in</Text>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {ROLE_LEVEL_OPTIONS.map((level) => (
                  <label key={level.value} className="flex items-center gap-2 text-caption">
                    <input
                      type="checkbox"
                      name="targetRoleLevels"
                      value={level.value}
                      className="h-4 w-4 rounded border-concrete text-matte-gold focus:ring-matte-gold"
                    />
                    {level.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Mobility */}
            <div>
              <Text variant="label">Mobility <span className="text-error">*</span></Text>
              <div className="mt-3 space-y-2">
                {MOBILITY_OPTIONS.map((option) => (
                  <label key={option.value} className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="mobility"
                      value={option.value}
                      defaultChecked={option.value === "local"}
                      className="mt-1 h-4 w-4 border-concrete text-matte-gold focus:ring-matte-gold"
                    />
                    <div>
                      <Text variant="body">{option.label}</Text>
                      <Text variant="caption">{option.description}</Text>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div>
              <Text variant="label">Job Search Status <span className="text-error">*</span></Text>
              <div className="mt-3 space-y-2">
                {TIMELINE_OPTIONS.map((option) => (
                  <label key={option.value} className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="timeline"
                      value={option.value}
                      defaultChecked={option.value === "passive"}
                      className="mt-1 h-4 w-4 border-concrete text-matte-gold focus:ring-matte-gold"
                    />
                    <div>
                      <Text variant="body">{option.label}</Text>
                      <Text variant="caption">{option.description}</Text>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Target Locations */}
            <Input
              label="Target Locations"
              name="targetLocations"
              type="text"
              placeholder="Paris, London, New York"
              helperText="Comma-separated list of preferred cities (optional)"
            />

            <div className="flex gap-4">
              <Link href="/talent/onboarding/divisions" className="flex-1">
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
