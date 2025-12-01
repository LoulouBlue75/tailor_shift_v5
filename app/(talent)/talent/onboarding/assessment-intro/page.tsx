import Link from "next/link";
import { completeOnboarding } from "@/app/actions/talent-onboarding";
import { Button, H3, Text, Stack, Card } from "@/components/ui";
import { StepProgress } from "@/components/onboarding/StepProgress";

export default function AssessmentIntroStep() {
  return (
    <div>
      <StepProgress currentStep={7} totalSteps={7} stepName="Assessment" />
      
      <Card className="p-8 text-center">
        <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-matte-gold/10 flex items-center justify-center">
          <svg className="h-8 w-8 text-matte-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <H3>Unlock Your Retail Excellence Profile</H3>
        
        <Text className="mt-4 max-w-md mx-auto">
          Complete our 4-dimensional assessment to discover your unique strengths
          and unlock personalized opportunities.
        </Text>

        <div className="mt-8 grid gap-4 text-left max-w-sm mx-auto">
          <div className="flex items-start gap-3">
            <div className="h-6 w-6 rounded-full bg-matte-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-sm text-matte-gold">1</span>
            </div>
            <div>
              <Text variant="body" className="font-medium">Service Excellence</Text>
              <Text variant="caption">Client experience and luxury standards</Text>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-6 w-6 rounded-full bg-matte-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-sm text-matte-gold">2</span>
            </div>
            <div>
              <Text variant="body" className="font-medium">Clienteling</Text>
              <Text variant="caption">Relationship building and CRM skills</Text>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-6 w-6 rounded-full bg-matte-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-sm text-matte-gold">3</span>
            </div>
            <div>
              <Text variant="body" className="font-medium">Operations</Text>
              <Text variant="caption">Process management and compliance</Text>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-6 w-6 rounded-full bg-matte-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-sm text-matte-gold">4</span>
            </div>
            <div>
              <Text variant="body" className="font-medium">Leadership Signals</Text>
              <Text variant="caption">Team management potential</Text>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 rounded bg-off-white">
          <Text variant="caption">
            <strong>Duration:</strong> 15-20 minutes • <strong>Format:</strong> Situational questions
          </Text>
        </div>

        <Stack gap="md" className="mt-8">
          <Link href="/talent/assessment">
            <Button className="w-full">Start Assessment Now</Button>
          </Link>
          
          <form action={completeOnboarding}>
            <Button type="submit" variant="ghost" className="w-full">
              Skip for now
            </Button>
          </form>
        </Stack>

        <Text variant="caption" className="mt-4">
          You can always complete the assessment later from your dashboard.
        </Text>
      </Card>
    </div>
  );
}
