'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Text } from '@/components/ui/Typography'
import { Button } from '@/components/ui/Button'

interface ScoreBreakdownProps {
  scores: {
    role_fit: number
    division_fit: number
    store_context: number
    capability_fit: number
    geography: number
    experience_block: number
    preference: number
  }
  compact?: boolean
}

const DIMENSIONS = [
  {
    key: 'role_fit' as const,
    label: 'Role Fit',
    tooltip: 'How well the role level matches career progression',
  },
  {
    key: 'division_fit' as const,
    label: 'Division Fit',
    tooltip: 'Expertise and experience in this division',
  },
  {
    key: 'store_context' as const,
    label: 'Store Context',
    tooltip: 'Experience with similar store complexity tier',
  },
  {
    key: 'capability_fit' as const,
    label: 'Capability Fit',
    tooltip: 'Skills and competencies match requirements',
  },
  {
    key: 'geography' as const,
    label: 'Geography',
    tooltip: 'Location alignment and mobility preferences',
  },
  {
    key: 'experience_block' as const,
    label: 'Experience',
    tooltip: 'Relevant experience blocks and background',
  },
  {
    key: 'preference' as const,
    label: 'Preference',
    tooltip: 'Alignment with career goals and timeline',
  },
]

function DimensionBar({
  label,
  score,
  tooltip,
}: {
  label: string
  score: number
  tooltip: string
}) {
  const colorClass =
    score >= 80
      ? 'bg-green-500'
      : score >= 60
      ? 'bg-yellow-500'
      : 'bg-orange-500'

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2">
          <Text variant="caption" className="font-medium">
            {label}
          </Text>
          <span
            className="text-soft-grey cursor-help text-xs"
            title={tooltip}
          >
            ⓘ
          </span>
        </div>
        <Text variant="caption" className="font-bold text-charcoal">
          {score}
        </Text>
      </div>
      <div className="w-full bg-concrete h-2 rounded-full overflow-hidden">
        <div
          className={`${colorClass} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  )
}

export function ScoreBreakdown({ scores, compact = false }: ScoreBreakdownProps) {
  const [expanded, setExpanded] = useState(!compact)

  const visibleDimensions = expanded ? DIMENSIONS : DIMENSIONS.slice(0, 3)

  return (
    <div className="space-y-3">
      {visibleDimensions.map((dim) => (
        <DimensionBar
          key={dim.key}
          label={dim.label}
          score={scores[dim.key]}
          tooltip={dim.tooltip}
        />
      ))}

      {compact && !expanded && (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setExpanded(true)}
          className="w-full"
        >
          Show all dimensions
        </Button>
      )}

      {compact && expanded && (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setExpanded(false)}
          className="w-full"
        >
          Show less
        </Button>
      )}
    </div>
  )
}
