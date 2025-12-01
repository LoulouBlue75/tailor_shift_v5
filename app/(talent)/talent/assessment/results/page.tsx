import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Container } from '@/components/ui/Layout'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { H1, H2, H3, Text } from '@/components/ui/Typography'
import { Badge } from '@/components/ui/Badge'
import { getDimensionLabel, getScoreInterpretation } from '@/lib/engines/assessment'
import { AssessmentDimension } from '@/data/assessment/questions'

async function getAssessmentResults() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: talent } = await supabase
    .from('talents')
    .select('id, assessment_summary')
    .eq('profile_id', user.id)
    .single()

  if (!talent || !talent.assessment_summary) {
    redirect('/talent/assessment')
  }

  // Get latest assessment for insights
  const { data: assessment } = await supabase
    .from('assessments')
    .select('*')
    .eq('talent_id', talent.id)
    .eq('status', 'completed')
    .order('completed_at', { ascending: false })
    .limit(1)
    .single()

  return {
    scores: talent.assessment_summary,
    assessment,
  }
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  const interpretation = getScoreInterpretation(score)
  const colorClass =
    interpretation.level === 'excellent'
      ? 'bg-green-500'
      : interpretation.level === 'strong'
      ? 'bg-matte-gold'
      : interpretation.level === 'developing'
      ? 'bg-blue-500'
      : 'bg-soft-grey'

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <Text variant="label">{label}</Text>
        <span className="text-2xl font-bold text-charcoal">{score}</span>
      </div>
      <div className="w-full bg-concrete h-3 rounded-full overflow-hidden">
        <div
          className={`h-3 ${colorClass} transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>
      <Text variant="caption" className="text-soft-grey mt-1">
        {interpretation.message}
      </Text>
    </div>
  )
}

export default async function AssessmentResultsPage() {
  const { scores, assessment } = await getAssessmentResults()

  // Calculate insights from scores
  const dimensionScores: [string, number][] = [
    ['Service Excellence', scores.service_excellence || 0],
    ['Clienteling', scores.clienteling || 0],
    ['Operations', scores.operations || 0],
    ['Leadership Signals', scores.leadership_signals || 0],
  ]

  const sorted = [...dimensionScores].sort((a, b) => b[1] - a[1])
  const strengths = sorted.slice(0, 2)
  const developmentAreas = sorted.slice(-2)

  const overallScore = Math.round(
    (scores.service_excellence + scores.clienteling + scores.operations + scores.leadership_signals) / 4
  )

  return (
    <Container size="xl">
      <div className="py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 rounded-full bg-matte-gold flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">✨</span>
            </div>
            <H1 className="mb-2">Assessment Complete!</H1>
            <Text variant="body" className="text-soft-grey text-lg">
              Here's your Retail Excellence profile
            </Text>
          </div>

          {/* Overall Score */}
          <Card variant="default" className="p-8 mb-8 bg-gradient-to-br from-matte-gold/10 to-white">
            <div className="text-center">
              <Text variant="caption" className="text-soft-grey mb-2">
                Overall Score
              </Text>
              <div className="text-6xl font-bold text-charcoal mb-2">{overallScore}</div>
              <Text variant="body" className="text-soft-grey">
                {getScoreInterpretation(overallScore).message}
              </Text>
            </div>
          </Card>

          {/* Dimension Scores */}
          <Card variant="default" className="p-8 mb-8">
            <H2 className="mb-6">Your Competency Profile</H2>
            <div className="space-y-6">
              <ScoreBar label="Service Excellence" score={scores.service_excellence || 0} />
              <ScoreBar label="Clienteling" score={scores.clienteling || 0} />
              <ScoreBar label="Operations" score={scores.operations || 0} />
              <ScoreBar label="Leadership Signals" score={scores.leadership_signals || 0} />
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Strengths */}
            <Card variant="default" className="p-6 bg-green-50">
              <H3 className="mb-4 flex items-center gap-2">
                <span>💪</span> Your Top Strengths
              </H3>
              <div className="space-y-3">
                {strengths.map(([dimension, score]) => (
                  <div key={dimension} className="flex justify-between items-center">
                    <Text variant="body" className="font-medium">
                      {dimension}
                    </Text>
                    <Badge variant="success">{score}</Badge>
                  </div>
                ))}
              </div>
              <Text variant="body" className="text-soft-grey mt-4 text-sm">
                These are your standout competencies. Leverage these in your career development.
              </Text>
            </Card>

            {/* Development Areas */}
            <Card variant="default" className="p-6 bg-blue-50">
              <H3 className="mb-4 flex items-center gap-2">
                <span>📈</span> Development Opportunities
              </H3>
              <div className="space-y-3">
                {developmentAreas.map(([dimension, score]) => (
                  <div key={dimension} className="flex justify-between items-center">
                    <Text variant="body" className="font-medium">
                      {dimension}
                    </Text>
                    <Badge>{score}</Badge>
                  </div>
                ))}
              </div>
              <Text variant="body" className="text-soft-grey mt-4 text-sm">
                Focus on these areas to accelerate your growth and unlock new opportunities.
              </Text>
            </Card>
          </div>

          {/* Recommended Paths */}
          <Card variant="default" className="p-8 mb-8">
            <H2 className="mb-4">Recommended Career Paths</H2>
            <Text variant="body" className="text-soft-grey mb-6">
              Based on your competency profile, these roles align well with your strengths:
            </Text>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Generate recommendations based on scores */}
              {scores.clienteling >= 75 && scores.service_excellence >= 70 && (
                <>
                  <Card variant="interactive" className="p-4">
                    <Text variant="label" className="mb-1">
                      Client Relationship Specialist
                    </Text>
                    <Text variant="caption" className="text-soft-grey">
                      Leverage your clienteling and service excellence
                    </Text>
                  </Card>
                  <Card variant="interactive" className="p-4">
                    <Text variant="label" className="mb-1">
                      VIC Manager
                    </Text>
                    <Text variant="caption" className="text-soft-grey">
                      Perfect for strong relationship builders
                    </Text>
                  </Card>
                </>
              )}
              {scores.leadership_signals >= 70 && (
                <>
                  <Card variant="interactive" className="p-4">
                    <Text variant="label" className="mb-1">
                      Team Lead
                    </Text>
                    <Text variant="caption" className="text-soft-grey">
                      Your leadership signals show management potential
                    </Text>
                  </Card>
                  <Card variant="interactive" className="p-4">
                    <Text variant="label" className="mb-1">
                      Floor Manager
                    </Text>
                    <Text variant="caption" className="text-soft-grey">
                      Lead teams and drive performance
                    </Text>
                  </Card>
                </>
              )}
              {scores.operations >= 75 && (
                <>
                  <Card variant="interactive" className="p-4">
                    <Text variant="label" className="mb-1">
                      Operations Coordinator
                    </Text>
                    <Text variant="caption" className="text-soft-grey">
                      Excel in process and operational excellence
                    </Text>
                  </Card>
                  <Card variant="interactive" className="p-4">
                    <Text variant="label" className="mb-1">
                      Stock Manager
                    </Text>
                    <Text variant="caption" className="text-soft-grey">
                      Manage inventory and supply chain
                    </Text>
                  </Card>
                </>
              )}
            </div>
          </Card>

          {/* Next Steps */}
          <Card variant="default" className="p-8">
            <H2 className="mb-6">Next Steps</H2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/talent/dashboard" className="block">
                <Card variant="interactive" className="p-6 h-full hover:border-matte-gold transition-colors">
                  <div className="text-3xl mb-3">🏠</div>
                  <H3 className="mb-2 text-lg">View Dashboard</H3>
                  <Text variant="body" className="text-soft-grey text-sm">
                    See your updated profile and opportunities
                  </Text>
                </Card>
              </Link>

              <Link href="/talent/profile" className="block">
                <Card variant="interactive" className="p-6 h-full hover:border-matte-gold transition-colors">
                  <div className="text-3xl mb-3">👤</div>
                  <H3 className="mb-2 text-lg">Update Profile</H3>
                  <Text variant="body" className="text-soft-grey text-sm">
                    Complete your profile to improve matching
                  </Text>
                </Card>
              </Link>

              <Link href="/talent/assessment" className="block">
                <Card variant="interactive" className="p-6 h-full hover:border-matte-gold transition-colors">
                  <div className="text-3xl mb-3">🔄</div>
                  <H3 className="mb-2 text-lg">Retake Later</H3>
                  <Text variant="body" className="text-soft-grey text-sm">
                    Retake after 6 months to track growth
                  </Text>
                </Card>
              </Link>
            </div>
          </Card>

          <div className="text-center mt-8">
            <Text variant="caption" className="text-soft-grey">
              🎯 Your scores are now being used to match you with relevant opportunities
            </Text>
          </div>
        </div>
      </div>
    </Container>
  )
}
