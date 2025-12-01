"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { saveIdentity } from "@/app/actions/talent-onboarding";
import { Button, Input, H3, Text, Stack, Card, PhoneInput } from "@/components/ui";
import { StepProgress } from "@/components/onboarding/StepProgress";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending} className="w-full">
      Continue
    </Button>
  );
}

export default function IdentityStep() {
  const [state, formAction] = useActionState(saveIdentity, null);

  return (
    <div>
      <StepProgress currentStep={2} totalSteps={7} stepName="Identity" />
      
      <Card className="p-8">
        <H3>Tell us about yourself</H3>
        <Text variant="caption" className="mt-2">
          This information helps us personalize your experience.
        </Text>

        {state?.error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <Text className="text-red-700 text-sm">{state.error}</Text>
          </div>
        )}

        <form action={formAction} className="mt-8">
          <Stack gap="lg">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                name="firstName"
                type="text"
                required
                placeholder="John"
              />
              <Input
                label="Last Name"
                name="lastName"
                type="text"
                required
                placeholder="Doe"
              />
            </div>

            <PhoneInput
              label="Phone"
              name="phone"
              helperText="Optional - for direct communication"
            />

            <Input
              label="LinkedIn URL"
              name="linkedinUrl"
              type="url"
              placeholder="https://linkedin.com/in/your-profile"
              helperText="Optional - helps verify your experience"
            />

            <SubmitButton />
          </Stack>
        </form>
      </Card>
    </div>
  );
}
