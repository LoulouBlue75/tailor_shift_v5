'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Text } from '@/components/ui/Typography'
import { LearningModule } from '@/data/learning/modules'
import { formatCategory } from '@/lib/engines/learning'

interface LearningModuleCardProps {
  module: LearningModule
  progress?: {
    status: 'not_started' | 'in_progress' | 'completed'
    progress_pct: number
  }
  highlighted?: boolean
  reason?: string
}

export function LearningModuleCard({
  module,
  progress,
  highlighted = false,
  reason,
}: LearningModuleCardProps) {
  const status = progress?.status || 'not_started'
  const progressPct = progress?.progress_pct || 0

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800',
  }

  const contentTypeIcons = {
    video: '🎥',
    article: '📄',
    quiz: '❓',
    exercise: '💪',
  }

  return (
    <Card
      variant={highlighted ? 'elevated' : 'default'}
      className={`p-6 ${highlighted ? 'border-2 border-matte-gold' : ''}`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="mb-3">
          {highlighted && reason && (
            <Badge variant="success" className="mb-2">
              {reason}
            </Badge>
          )}
          <Link href={`/talent/learning/${module.id}`}>
            <h3 className="text-lg font-semibold text-charcoal hover:text-matte-gold transition-colors cursor-pointer">
              {module.title}
            </h3>
          </Link>
        </div>

        {/* Description */}
        <Text variant="body" className="text-soft-grey text-sm mb-4 flex-1 line-clamp-3">
          {module.description}
        </Text>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs">
            {contentTypeIcons[module.content_type]} {formatCategory(module.category)}
          </span>
          <Badge size="sm" className={difficultyColors[module.difficulty]}>
            {module.difficulty}
          </Badge>
          <Badge size="sm">{module.duration_minutes} min</Badge>
        </div>

        {/* Progress Bar */}
        {status !== 'not_started' && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <Text variant="caption" className="text-soft-grey">
                Progress
              </Text>
              <Text variant="caption" className="text-charcoal font-medium">
                {progressPct}%
              </Text>
            </div>
            <div className="w-full bg-concrete h-2 rounded-full overflow-hidden">
              <div
                className="bg-matte-gold h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        <Link href={`/talent/learning/${module.id}`}>
          <Button
            variant={status === 'not_started' ? 'primary' : 'secondary'}
            size="sm"
            className="w-full"
          >
            {status === 'completed' && '✓ '}
            {status === 'completed'
              ? 'Review'
              : status === 'in_progress'
              ? 'Continue'
              : 'Start Module'}
          </Button>
        </Link>
      </div>
    </Card>
  )
}
