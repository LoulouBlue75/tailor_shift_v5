import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Container } from '@/components/ui/Layout'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { H1, H2, H3, Text } from '@/components/ui/Typography'
import { Badge } from '@/components/ui/Badge'

async function getAssessmentStatus() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: talent } = await supabase
    .from('talents')
    .select('assessment_summary')
    .eq('profile_id', user.id)
    .single()

  return {
    hasCompleted: talent?.assessment_summary?.completed_at ? true : false,
    lastCompleted: talent?.assessment_summary?.completed_at || null,
  }
}

export default async function AssessmentIntroPage() {
  const status = await getAssessmentStatus()

  return (
    <Container size="lg">
      <div className="py-12">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <H1 className="mb-4">Retail Excellence Scan</H1>
          <Text variant="body" className="text-soft-grey text-lg">
            Discover your strengths and unlock personalized opportunities
          </Text>
        </div>

        <Card variant="default" className="p-8 max-w-3xl mx-auto mb-8">
          <H2 className="mb-6">What is the Retail Excellence Scan?</H2>
          <Text variant="body" className="mb-6">
            This comprehensive assessment evaluates your competencies across four key dimensions
            of luxury retail excellence. Your results will help match you with the right
            opportunities and provide personalized development recommendations.
          </Text>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            <Card variant="interactive" className="p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-matte-gold flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">1</span>
                </div>
                <div>
                  <H3 className="mb-2">Service Excellence</H3>
                  <Text variant="body" className="text-soft-grey text-sm">
                    Your ability to deliver exceptional client experiences and maintain luxury
                    standards
                  </Text>
                </div>
              </div>
            </Card>

            <Card variant="interactive" className="p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-matte-gold flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">2</span>
                </div>
                <div>
                  <H3 className="mb-2">Clienteling</H3>
                  <Text variant="body" className="text-soft-grey text-sm">
                    Your skills in building and maintaining long-term client relationships
                  </Text>
                </div>
              </div>
            </Card>

            <Card variant="interactive" className="p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-matte-gold flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">3</span>
                </div>
                <div>
                  <H3 className="mb-2">Operations</H3>
                  <Text variant="body" className="text-soft-grey text-sm">
                    Your competency in managing processes, inventory, and operational excellence
                  </Text>
                </div>
              </div>
            </Card>

            <Card variant="interactive" className="p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-matte-gold flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">4</span>
                </div>
                <div>
                  <H3 className="mb-2">Leadership Signals</H3>
                  <Text variant="body" className="text-soft-grey text-sm">
                    Your capacity to influence, mentor, and lead teams effectively
                  </Text>
                </div>
              </div>
            </Card>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8">
            <H3 className="mb-4">Assessment Details</H3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⏱️</span>
                <div>
                  <Text variant="label">Duration</Text>
                  <Text variant="body" className="text-soft-grey">
                    15-20 minutes
                  </Text>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">❓</span>
                <div>
                  <Text variant="label">Questions</Text>
                  <Text variant="body" className="text-soft-grey">
                    12 scenario-based questions
                  </Text>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔒</span>
                <div>
                  <Text variant="label">Privacy</Text>
                  <Text variant="body" className="text-soft-grey">
                    Your answers are used only for scoring and are never shared
                  </Text>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-soft-grey/20 rounded-lg p-6 my-8">
            <H3 className="mb-3">What You'll Receive</H3>
            <ul className="space-y-2">
              <li className="flex gap-2">
                <span className="text-matte-gold">✓</span>
                <Text variant="body">Detailed scores across all four dimensions</Text>
              </li>
              <li className="flex gap-2">
                <span className="text-matte-gold">✓</span>
                <Text variant="body">Identification of your top strengths</Text>
              </li>
              <li className="flex gap-2">
                <span className="text-matte-gold">✓</span>
                <Text variant="body">Areas for professional development</Text>
              </li>
              <li className="flex gap-2">
                <span className="text-matte-gold">✓</span>
                <Text variant="body">Recommended career paths based on your profile</Text>
              </li>
              <li className="flex gap-2">
                <span className="text-matte-gold">✓</span>
                <Text variant="body">Personalized learning recommendations</Text>
              </li>
            </ul>
          </div>

          {status.hasCompleted && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <Text variant="body" className="text-green-800">
                ✓ You completed this assessment on{' '}
                {new Date(status.lastCompleted).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
                . You can retake it to update your profile.
              </Text>
            </div>
          )}

          <div className="flex gap-4 justify-center mt-8">
            <Link href="/talent/dashboard">
              <Button variant="secondary">Back to Dashboard</Button>
            </Link>
            <Link href="/talent/assessment/start">
              <Button variant="primary" size="lg">
                {status.hasCompleted ? 'Retake Assessment' : 'Start Assessment'}
              </Button>
            </Link>
          </div>
        </Card>

        <div className="max-w-3xl mx-auto text-center mt-8">
          <Text variant="caption" className="text-soft-grey">
            💡 Tip: Take this assessment in a quiet environment where you can focus for 15-20
            minutes without interruptions.
          </Text>
        </div>
      </div>
    </Container>
  )
}
