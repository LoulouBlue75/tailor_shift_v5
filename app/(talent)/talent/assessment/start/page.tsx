'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Container } from '@/components/ui/Layout'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { H2, H3, Text } from '@/components/ui/Typography'
import { ASSESSMENT_QUESTIONS_V1 } from '@/data/assessment/questions'
import { submitAssessment } from '@/app/actions/assessments'

export default function AssessmentStartPage() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentQuestion = ASSESSMENT_QUESTIONS_V1[currentIndex]
  const progress = ((currentIndex + 1) / ASSESSMENT_QUESTIONS_V1.length) * 100
  const isLastQuestion = currentIndex === ASSESSMENT_QUESTIONS_V1.length - 1

  const handleNext = async () => {
    if (isLastQuestion) {
      await handleSubmit()
    } else {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      const result = await submitAssessment(answers)
      
      if (result.success) {
        router.push('/talent/assessment/results')
      } else {
        setError(result.error || 'Failed to submit assessment')
        setIsSubmitting(false)
      }
    } catch (err) {
      console.error('Error submitting assessment:', err)
      setError('An unexpected error occurred')
      setIsSubmitting(false)
    }
  }

  return (
    <Container size="md">
      <div className="py-8 min-h-screen">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-concrete h-2 rounded-full mb-2">
            <div
              className="bg-matte-gold h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <Text variant="caption" className="text-soft-grey">
              Question {currentIndex + 1} of {ASSESSMENT_QUESTIONS_V1.length}
            </Text>
            <Text variant="caption" className="text-soft-grey">
              {Math.round(progress)}% Complete
            </Text>
          </div>
        </div>

        {error && (
          <Card variant="interactive" className="p-4 bg-red-50 border-red-200 mb-6">
            <Text variant="body" className="text-red-600">
              {error}
            </Text>
          </Card>
        )}

        {/* Question Card */}
        <Card variant="default" className="p-8">
          <div className="mb-6">
            <Text variant="caption" className="text-matte-gold mb-2">
              {currentQuestion.type === 'likert' ? 'Rating Scale' : 
               currentQuestion.type === 'situational' ? 'Situational Question' : 
               'Multiple Choice'}
            </Text>
            <H2 className="mb-4">{currentQuestion.text}</H2>
          </div>

          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected = answers[currentQuestion.id] === option.id
              
              return (
                <label
                  key={option.id}
                  className={`
                    flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all
                    ${isSelected 
                      ? 'border-matte-gold bg-matte-gold/5' 
                      : 'border-concrete hover:border-matte-gold/50'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name={currentQuestion.id}
                    value={option.id}
                    checked={isSelected}
                    onChange={(e) =>
                      setAnswers({
                        ...answers,
                        [currentQuestion.id]: e.target.value,
                      })
                    }
                    className="mt-1 mr-4 w-4 h-4 text-matte-gold focus:ring-matte-gold"
                  />
                  <span className={isSelected ? 'font-medium' : ''}>
                    {option.text}
                  </span>
                </label>
              )
            })}
          </div>

          <div className="flex justify-between mt-8 pt-6 border-t border-concrete">
            <Button
              variant="secondary"
              onClick={handlePrevious}
              disabled={currentIndex === 0 || isSubmitting}
            >
              ← Previous
            </Button>
            <Button
              variant="primary"
              onClick={handleNext}
              disabled={!answers[currentQuestion.id] || isSubmitting}
            >
              {isSubmitting
                ? 'Submitting...'
                : isLastQuestion
                ? 'Submit Assessment'
                : 'Next →'}
            </Button>
          </div>
        </Card>

        {/* Helper Text */}
        <div className="mt-6 text-center">
          <Text variant="caption" className="text-soft-grey">
            💡 Choose the answer that best reflects your approach or beliefs
          </Text>
        </div>
      </div>
    </Container>
  )
}
