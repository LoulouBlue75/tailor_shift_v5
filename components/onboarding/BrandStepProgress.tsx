"use client";

import { cn } from "@/lib/utils/cn";

interface BrandStepProgressProps {
  currentStep: number;
  className?: string;
}

const STEPS = [
  { id: 1, name: "Account" },
  { id: 2, name: "Identity" },
  { id: 3, name: "Contact" },
  { id: 4, name: "Store" },
  { id: 5, name: "Finish" },
];

export function BrandStepProgress({ currentStep, className }: BrandStepProgressProps) {
  return (
    <div className={cn("mb-8", className)}>
      {/* Step indicator dots */}
      <div className="flex items-center justify-center gap-2 mb-4">
        {STEPS.map((step) => (
          <div
            key={step.id}
            className={cn(
              "w-3 h-3 rounded-full transition-colors",
              step.id < currentStep
                ? "bg-matte-gold"
                : step.id === currentStep
                ? "bg-matte-gold"
                : "bg-concrete"
            )}
          />
        ))}
      </div>
      
      {/* Step label */}
      <p className="text-center text-caption text-soft-grey">
        Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1]?.name}
      </p>
    </div>
  );
}
