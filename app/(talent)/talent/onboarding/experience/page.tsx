"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { saveExperience } from "@/app/actions/talent-onboarding";
import { Button, Input, H3, Text, Stack, Card } from "@/components/ui";
import { StepProgress } from "@/components/onboarding/StepProgress";
import { EXPERIENCE_BLOCK_OPTIONS, DIVISION_OPTIONS } from "@/data/mcs";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending} className="w-full">
      Continue
    </Button>
  );
}

export default function ExperienceStep() {
  const [state, formAction] = useActionState(saveExperience, null);

  return (
    <div>
      <StepProgress currentStep={6} totalSteps={7} stepName="Experience" />
      
      <Card className="p-8">
        <H3>Your most recent experience</H3>
        <Text variant="caption" className="mt-2">
          Add your current or most recent position. You can add more later.
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
                Experience Type <span className="text-error">*</span>
              </label>
              <select
                name="blockType"
                required
                className="mt-2 block w-full rounded border border-concrete bg-white px-4 py-3 text-body text-charcoal focus:border-matte-gold focus:outline-none focus:ring-1 focus:ring-matte-gold"
              >
                <option value="">Select type</option>
                {EXPERIENCE_BLOCK_OPTIONS.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Job Title"
              name="title"
              type="text"
              required
              placeholder="e.g., Senior Sales Advisor"
            />

            <Input
              label="Company / Maison"
              name="company"
              type="text"
              required
              placeholder="e.g., Louis Vuitton"
            />

            <Input
              label="Location"
              name="location"
              type="text"
              placeholder="e.g., Paris, France"
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Start Date"
                name="startDate"
                type="date"
                required
              />
              <Input
                label="End Date"
                name="endDate"
                type="date"
                helperText="Leave empty if current"
              />
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isCurrent"
                value="true"
                className="h-4 w-4 rounded border-concrete text-matte-gold focus:ring-matte-gold"
              />
              <Text variant="body">This is my current position</Text>
            </label>

            <div>
              <label className="block text-label font-medium text-charcoal">
                Division
              </label>
              <select
                name="division"
                className="mt-2 block w-full rounded border border-concrete bg-white px-4 py-3 text-body text-charcoal focus:border-matte-gold focus:outline-none focus:ring-1 focus:ring-matte-gold"
              >
                <option value="">Select division (optional)</option>
                {DIVISION_OPTIONS.map((div) => (
                  <option key={div.value} value={div.value}>
                    {div.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-label font-medium text-charcoal">
                Key Achievements
              </label>
              <textarea
                name="achievements"
                rows={3}
                placeholder="One achievement per line..."
                className="mt-2 block w-full rounded border border-concrete bg-white px-4 py-3 text-body text-charcoal placeholder:text-soft-grey focus:border-matte-gold focus:outline-none focus:ring-1 focus:ring-matte-gold"
              />
              <Text variant="caption" className="mt-1">Optional - Enter each achievement on a new line</Text>
            </div>

            <div className="flex gap-4">
              <Link href="/talent/onboarding/preferences" className="flex-1">
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
