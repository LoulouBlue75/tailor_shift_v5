import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Container } from '@/components/ui/Layout'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { H1, H2, H3, Text } from '@/components/ui/Typography'
import { Badge } from '@/components/ui/Badge'
import {
  generateCareerProjection,
  getReadinessLabel,
  getReadinessDescription,
  getRoleTitle,
} from '@/lib/engines/projection'

async function getTalentData() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: talent } = await supabase
    .from('talents')
    .select('*')
    .eq('profile_id', user.id)
    .single()

  if (!talent) {
    redirect('/talent/onboarding')
  }

  return talent
}

export default async function ProjectionPage() {
  const talent = await getTalentData()
  const projection = generateCareerProjection(talent)

  const hasAssessment = talent.assessment_summary?.completed_at

  const readinessConfig = {
    ready_now: { label: 'Ready Now', color: 'bg-green-100 text-green-800', variant: 'success' as const },
    ready_soon: { label: 'Ready Soon', color: 'bg-yellow-100 text-yellow-800', variant: 'warning' as const },
    developing: { label: 'Developing', color: 'bg-gray-100 text-gray-600', variant: 'default' as const },
  }

  const readinessStyle = readinessConfig[projection.next_role.readiness]

  const formatTimeline = (min: number, max: number): string => {
    if (min === 0 && max === 0) return 'At peak level'
    if (min >= 12) {
      const minYears = Math.round(min / 12)
      const maxYears = Math.round(max / 12)
      if (minYears === maxYears) return `~${minYears} year${minYears > 1 ? 's' : ''}`
      return `${minYears}-${maxYears} years`
    }
    return `${min}-${max} months`
  }

  const isMaxLevel = projection.current_role.level === projection.next_role.level

  // Career ladder levels
  const allLevels = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8']
  const currentIndex = allLevels.indexOf(projection.current_role.level)

  return (
    <Container size="xl">
      <div className="py-8">
        <div className="mb-6">
          <Link href="/talent/dashboard">
            <Button variant="secondary">← Back to Dashboard</Button>
          </Link>
        </div>

        <div className="mb-8">
          <H1 className="mb-2">Your Career Projection</H1>
          <Text variant="body" className="text-soft-grey">
            Personalized insights into your career trajectory in luxury retail
          </Text>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current & Next Role */}
            <Card variant="default" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Current */}
                <div className="p-4 bg-matte-gold/10 rounded-lg">
                  <Text variant="caption" className="text-soft-grey mb-2">
                    Current Role
                  </Text>
                  <div className="text-3xl font-bold text-charcoal">
                    {projection.current_role.level}
                  </div>
                  <Text variant="body" className="font-medium">
                    {projection.current_role.title}
                  </Text>
                  {talent.years_in_luxury !== null && (
                    <Text variant="caption" className="text-soft-grey mt-2">
                      {talent.years_in_luxury} years in luxury
                    </Text>
                  )}
                </div>

                {/* Next */}
                <div className="p-4 border-2 border-dashed border-concrete rounded-lg">
                  <Text variant="caption" className="text-soft-grey mb-2">
                    Next Role
                  </Text>
                  <div className="text-3xl font-bold text-charcoal">
                    {projection.next_role.level}
                  </div>
                  <Text variant="body" className="font-medium">
                    {projection.next_role.typical_titles[0]}
                  </Text>
                  <div className="mt-2 flex gap-2">
                    <Badge variant={readinessStyle.variant}>{readinessStyle.label}</Badge>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              {!isMaxLevel && (
                <div className="mt-6 p-4 bg-off-white rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <Text variant="label" className="text-soft-grey">
                        Estimated Timeline
                      </Text>
                      <Text variant="body" className="font-bold text-xl">
                        {formatTimeline(
                          projection.timeline_estimate.min_months,
                          projection.timeline_estimate.max_months
                        )}
                      </Text>
                    </div>
                    <div className="text-right">
                      <Text variant="caption" className="text-soft-grey">
                        {getReadinessDescription(projection.next_role.readiness)}
                      </Text>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Capability Gaps */}
            {projection.capability_gaps.length > 0 && (
              <Card variant="default" className="p-6">
                <H3 className="mb-4">Areas to Develop</H3>
                <div className="space-y-4">
                  {projection.capability_gaps.map((gap, index) => {
                    // Parse gap string to extract dimension and scores
                    const parts = gap.split(':')
                    const dimension = parts[0]
                    const details = parts[1] || ''

                    return (
                      <div key={index} className="p-4 bg-off-white rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-orange-600">↑</span>
                          </div>
                          <div>
                            <Text variant="body" className="font-medium">
                              {dimension}
                            </Text>
                            <Text variant="caption" className="text-soft-grey">
                              {details.trim()}
                            </Text>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-4">
                  <Link href="/talent/learning">
                    <Button variant="primary" size="sm">
                      Browse Learning Modules
                    </Button>
                  </Link>
                </div>
              </Card>
            )}

            {/* Recommended Experiences */}
            <Card variant="default" className="p-6">
              <H3 className="mb-4">Recommended Experiences</H3>
              <Text variant="body" className="text-soft-grey mb-4">
                Activities and experiences that will accelerate your growth toward{' '}
                {projection.next_role.level}
              </Text>
              <ul className="space-y-3">
                {projection.recommended_experiences.map((exp, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="text-matte-gold flex-shrink-0">✓</span>
                    <Text variant="body">{exp}</Text>
                  </li>
                ))}
              </ul>
            </Card>

            {/* No Assessment Warning */}
            {!hasAssessment && (
              <Card variant="default" className="p-6 bg-blue-50">
                <H3 className="mb-2">Complete Your Assessment</H3>
                <Text variant="body" className="text-soft-grey mb-4">
                  Your projection is based on limited data. Complete the Retail Excellence
                  Assessment to get a more accurate career projection with specific
                  capability insights.
                </Text>
                <Link href="/talent/assessment">
                  <Button variant="primary">Start Assessment</Button>
                </Link>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Career Ladder */}
            <Card variant="default" className="p-6">
              <H3 className="mb-4">Career Ladder</H3>
              <div className="space-y-2">
                {allLevels
                  .slice()
                  .reverse()
                  .map((level, index) => {
                    const levelIndex = allLevels.indexOf(level)
                    const isCurrent = level === projection.current_role.level
                    const isNext = level === projection.next_role.level && !isMaxLevel
                    const isPast = levelIndex < currentIndex
                    const isFuture = levelIndex > currentIndex + 1

                    return (
                      <div
                        key={level}
                        className={`flex items-center gap-3 p-2 rounded ${
                          isCurrent
                            ? 'bg-matte-gold/10 border border-matte-gold'
                            : isNext
                            ? 'bg-blue-50 border border-blue-200'
                            : ''
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            isCurrent
                              ? 'bg-matte-gold text-white'
                              : isPast
                              ? 'bg-green-500 text-white'
                              : isNext
                              ? 'bg-blue-500 text-white'
                              : 'bg-concrete text-soft-grey'
                          }`}
                        >
                          {isPast ? '✓' : level}
                        </div>
                        <div className="flex-1">
                          <Text
                            variant="caption"
                            className={`font-medium ${
                              isCurrent || isNext ? 'text-charcoal' : 'text-soft-grey'
                            }`}
                          >
                            {getRoleTitle(level)}
                          </Text>
                          {isCurrent && (
                            <Text variant="caption" className="text-matte-gold text-xs">
                              Current
                            </Text>
                          )}
                          {isNext && (
                            <Text variant="caption" className="text-blue-600 text-xs">
                              Next
                            </Text>
                          )}
                        </div>
                      </div>
                    )
                  })}
              </div>
            </Card>

            {/* Assessment Scores */}
            {hasAssessment && talent.assessment_summary && (
              <Card variant="default" className="p-6">
                <H3 className="mb-4">Your Capabilities</H3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <Text variant="caption">Service Excellence</Text>
                      <Text variant="caption" className="font-bold">
                        {talent.assessment_summary.service_excellence}
                      </Text>
                    </div>
                    <div className="w-full bg-concrete h-2 rounded-full">
                      <div
                        className="bg-matte-gold h-2 rounded-full"
                        style={{ width: `${talent.assessment_summary.service_excellence}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <Text variant="caption">Clienteling</Text>
                      <Text variant="caption" className="font-bold">
                        {talent.assessment_summary.clienteling}
                      </Text>
                    </div>
                    <div className="w-full bg-concrete h-2 rounded-full">
                      <div
                        className="bg-matte-gold h-2 rounded-full"
                        style={{ width: `${talent.assessment_summary.clienteling}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <Text variant="caption">Operations</Text>
                      <Text variant="caption" className="font-bold">
                        {talent.assessment_summary.operations}
                      </Text>
                    </div>
                    <div className="w-full bg-concrete h-2 rounded-full">
                      <div
                        className="bg-matte-gold h-2 rounded-full"
                        style={{ width: `${talent.assessment_summary.operations}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <Text variant="caption">Leadership</Text>
                      <Text variant="caption" className="font-bold">
                        {talent.assessment_summary.leadership_signals}
                      </Text>
                    </div>
                    <div className="w-full bg-concrete h-2 rounded-full">
                      <div
                        className="bg-matte-gold h-2 rounded-full"
                        style={{ width: `${talent.assessment_summary.leadership_signals}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Engine Info */}
            <Card variant="default" className="p-4 bg-off-white">
              <Text variant="caption" className="text-soft-grey">
                Projection Engine {projection.engine_version}
              </Text>
              <Text variant="caption" className="text-soft-grey block mt-1">
                This projection is based on your profile, assessment, and industry benchmarks.
                Actual timelines may vary based on opportunities and individual circumstances.
              </Text>
            </Card>
          </div>
        </div>
      </div>
    </Container>
  )
}
