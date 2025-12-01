import { redirect } from "next/navigation";

export default function OnboardingPage() {
  // Step 1 is auth (already completed)
  // Redirect to Step 2: Identity
  redirect("/talent/onboarding/identity");
}
