import Link from 'next/link'
import { Card, Text, Button } from '@/components/ui'
import { generateCareerProjection, type ProjectionTalent } from '@/lib/engines/projection'

interface CareerProjectionProps {
  talent: ProjectionTalent
}

export function CareerProjection({ talent }: CareerProjectionProps) {
  // Generate projection using the engine
  const projection = generateCareerProjection(talent)

  const readinessConfig = {
    ready_now: { label: 'Ready Now', color: 'bg-green-100 text-green-800' },
    ready_soon: { label: 'Ready Soon', color: 'bg-yellow-100 text-yellow-800' },
    developing: { label: 'Developing', color: 'bg-gray-100 text-gray-600' },
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

  return (
    <Card className="p-6">
      <Text variant="caption" className="uppercase tracking-wider text-soft-grey">
        Your Career Path
      </Text>

      <div className="mt-6 space-y-4">
        {/* Current Role */}
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-full bg-matte-gold flex items-center justify-center flex-shrink-0">
            <svg
              className="h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div>
            <Text variant="caption" className="text-soft-grey">
              Current Level
            </Text>
            <Text className="font-medium">
              {projection.current_role.level} - {projection.current_role.title}
            </Text>
            {talent.years_in_luxury !== null && (
              <Text variant="caption" className="text-soft-grey">
                {talent.years_in_luxury} years in luxury retail
              </Text>
            )}
          </div>
        </div>

        {/* Connector */}
        <div className="ml-4 h-6 w-px bg-concrete" />

        {/* Next Role */}
        {!isMaxLevel ? (
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full border-2 border-dashed border-concrete flex items-center justify-center flex-shrink-0">
              <span className="text-xs text-soft-grey">{projection.next_role.level}</span>
            </div>
            <div>
              <Text variant="caption" className="text-soft-grey">
                Next Level
              </Text>
              <Text className="font-medium">
                {projection.next_role.level} - {projection.next_role.typical_titles[0]}
              </Text>

              <div className="mt-2 flex flex-wrap gap-2">
                <span className={`text-xs px-2 py-1 rounded ${readinessStyle.color}`}>
                  {readinessStyle.label}
                </span>
                <Text variant="caption" className="text-soft-grey">
                  Est.{' '}
                  {formatTimeline(
                    projection.timeline_estimate.min_months,
                    projection.timeline_estimate.max_months
                  )}
                </Text>
              </div>

              {/* Quick Gaps Preview */}
              {projection.capability_gaps.length > 0 && (
                <div className="mt-3">
                  <Text variant="caption" className="text-soft-grey">
                    {projection.capability_gaps.length} area
                    {projection.capability_gaps.length > 1 ? 's' : ''} to develop
                  </Text>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-matte-gold/10 flex items-center justify-center flex-shrink-0">
              <svg
                className="h-4 w-4 text-matte-gold"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            </div>
            <div>
              <Text className="font-medium">Top of the ladder!</Text>
              <Text variant="caption" className="mt-1 text-soft-grey">
                You've reached {projection.current_role.title} level.
              </Text>
            </div>
          </div>
        )}
      </div>

      {/* Assessment Tip */}
      {!talent.assessment_summary?.completed_at && (
        <div className="mt-6 p-3 rounded bg-off-white">
          <Text variant="caption">
            <strong>Tip:</strong> Complete your assessment to get an accurate career
            projection with personalized recommendations.
          </Text>
        </div>
      )}

      {/* View Full Projection Link */}
      <Link href="/talent/projection">
        <Button variant="secondary" size="sm" className="mt-4 w-full">
          View Full Projection
        </Button>
      </Link>
    </Card>
  )
}
