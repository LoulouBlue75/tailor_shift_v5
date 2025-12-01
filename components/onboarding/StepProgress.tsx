"use client";

import { Text } from "@/components/ui";

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  stepName: string;
}

export function StepProgress({ currentStep, totalSteps, stepName }: StepProgressProps) {
  return (
    <div className="mb-8">
      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 mb-4">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`h-2 w-2 rounded-full transition-colors ${
              i + 1 <= currentStep ? "bg-matte-gold" : "bg-concrete"
            }`}
          />
        ))}
      </div>
      {/* Step label */}
      <Text variant="caption" className="text-center">
        Step {currentStep} of {totalSteps}: {stepName}
      </Text>
    </div>
  );
}
