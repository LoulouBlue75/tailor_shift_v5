'use client'

import { use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Container } from '@/components/ui/Layout'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { H1, H2, H3, Text } from '@/components/ui/Typography'
import { Badge } from '@/components/ui/Badge'
import { LEARNING_MODULES } from '@/data/learning/modules'
import { formatCategory } from '@/lib/engines/learning'
import { startModule, completeModule } from '@/app/actions/learning'
import { useState, useTransition } from 'react'

export default function ModuleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const learningModule = LEARNING_MODULES.find((m) => m.id === resolvedParams.id)

  if (!learningModule) {
    return (
      <Container>
        <div className="py-12 text-center">
          <H1 className="mb-4">Module Not Found</H1>
          <Link href="/talent/learning">
            <Button variant="secondary">Back to Learning</Button>
          </Link>
        </div>
      </Container>
    )
  }

  const handleStartModule = async () => {
    setError(null)
    startTransition(async () => {
      const result = await startModule(learningModule.id)
      if (result.success) {
        // In V2, redirect to actual content. V1: external link
        window.open(learningModule.content_url, '_blank')
        router.refresh()
      } else {
        setError(result.error || 'Failed to start module')
      }
    })
  }

  const handleCompleteModule = async () => {
    setError(null)
    startTransition(async () => {
      const result = await completeModule(learningModule.id)
      if (result.success) {
        router.push('/talent/learning')
      } else {
        setError(result.error || 'Failed to complete module')
      }
    })
  }

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800',
  }

  const contentTypeLabels = {
    video: 'Video Course',
    article: 'Reading Material',
    quiz: 'Interactive Quiz',
    exercise: 'Practical Exercise',
  }

  return (
    <Container size="xl">
      <div className="py-8">
        <div className="mb-6">
          <Link href="/talent/learning">
            <Button variant="secondary">← Back to Learning</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <H1 className="mb-4">{learningModule.title}</H1>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge>{formatCategory(learningModule.category)}</Badge>
                <Badge className={difficultyColors[learningModule.difficulty]}>
                  {learningModule.difficulty}
                </Badge>
                <Badge>{learningModule.duration_minutes} minutes</Badge>
                <Badge>{contentTypeLabels[learningModule.content_type]}</Badge>
              </div>

              <Text variant="body" className="text-soft-grey leading-relaxed">
                {learningModule.description}
              </Text>
            </div>

            {/* What You'll Learn */}
            <Card variant="default" className="p-6">
              <H3 className="mb-4">What You'll Learn</H3>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-matte-gold">✓</span>
                  <Text variant="body">
                    Practical skills applicable to your daily work
                  </Text>
                </li>
                <li className="flex gap-3">
                  <span className="text-matte-gold">✓</span>
                  <Text variant="body">
                    Best practices from luxury retail leaders
                  </Text>
                </li>
                <li className="flex gap-3">
                  <span className="text-matte-gold">✓</span>
                  <Text variant="body">
                    Strategies to enhance client experiences
                  </Text>
                </li>
                <li className="flex gap-3">
                  <span className="text-matte-gold">✓</span>
                  <Text variant="body">
                    Techniques to advance your career
                  </Text>
                </li>
              </ul>
            </Card>

            {/* Target Audience */}
            {learningModule.target_role_levels.length > 0 && (
              <Card variant="default" className="p-6">
                <H3 className="mb-4">Recommended For</H3>
                <div className="flex flex-wrap gap-2">
                  {learningModule.target_role_levels.map((level) => (
                    <Badge key={level}>{level}</Badge>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Module Info */}
            <Card variant="default" className="p-6">
              <H3 className="mb-4">Module Details</H3>
              <div className="space-y-3">
                <div>
                  <Text variant="label" className="text-soft-grey mb-1">
                    Duration
                  </Text>
                  <Text variant="body">{learningModule.duration_minutes} minutes</Text>
                </div>
                <div>
                  <Text variant="label" className="text-soft-grey mb-1">
                    Difficulty
                  </Text>
                  <Text variant="body" className="capitalize">
                    {learningModule.difficulty}
                  </Text>
                </div>
                <div>
                  <Text variant="label" className="text-soft-grey mb-1">
                    Format
                  </Text>
                  <Text variant="body">{contentTypeLabels[learningModule.content_type]}</Text>
                </div>
                <div>
                  <Text variant="label" className="text-soft-grey mb-1">
                    Category
                  </Text>
                  <Text variant="body">{formatCategory(learningModule.category)}</Text>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <Card variant="default" className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              <Button
                variant="primary"
                className="w-full mb-3"
                onClick={handleStartModule}
                disabled={isPending}
              >
                {isPending ? 'Starting...' : 'Start Module'}
              </Button>
              
              <Button
                variant="secondary"
                className="w-full"
                onClick={handleCompleteModule}
                disabled={isPending}
              >
                Mark as Completed
              </Button>
              
              <Text variant="caption" className="text-soft-grey mt-3 block text-center">
                V1: External content link
              </Text>
            </Card>

            {/* Why This Module */}
            {learningModule.target_gaps.length > 0 && (
              <Card variant="default" className="p-6 bg-blue-50">
                <H3 className="mb-2 text-sm">Why This Module?</H3>
                <Text variant="caption" className="text-soft-grey">
                  This module helps strengthen your{' '}
                  {learningModule.target_gaps.map((g) => g.replace(/_/g, ' ')).join(', ')}{' '}
                  skills based on your assessment results.
                </Text>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Container>
  )
}
