/**
 * Assessment Scoring Engine
 * Computes scores and generates insights from assessment answers
 */

import { 
  ASSESSMENT_QUESTIONS_V1, 
  AssessmentDimension,
  ASSESSMENT_VERSION 
} from '@/data/assessment/questions'

export interface AssessmentAnswers {
  [questionId: string]: string // option ID
}

export interface AssessmentScores {
  service_excellence: number
  clienteling: number
  operations: number
  leadership_signals: number
}

export interface AssessmentInsights {
  strengths: string[]
  development_areas: string[]
  recommended_paths: string[]
  overall_score: number
}

export interface AssessmentResult {
  scores: AssessmentScores
  insights: AssessmentInsights
  version: string
}

/**
 * Score an assessment based on answers
 */
export function scoreAssessment(answers: AssessmentAnswers): AssessmentScores {
  const dimensionScores: Record<AssessmentDimension, { total: number; weight: number }> = {
    service_excellence: { total: 0, weight: 0 },
    clienteling: { total: 0, weight: 0 },
    operations: { total: 0, weight: 0 },
    leadership_signals: { total: 0, weight: 0 },
  }

  // Calculate weighted scores for each dimension
  ASSESSMENT_QUESTIONS_V1.forEach(question => {
    const selectedOptionId = answers[question.id]
    if (!selectedOptionId) return

    const selectedOption = question.options.find(o => o.id === selectedOptionId)
    if (!selectedOption) return

    const dimension = question.dimension
    dimensionScores[dimension].total += selectedOption.score * question.weight
    dimensionScores[dimension].weight += question.weight
  })

  // Normalize to 0-100 scale
  const scores: AssessmentScores = {
    service_excellence: Math.round(
      (dimensionScores.service_excellence.total / dimensionScores.service_excellence.weight) * 100
    ),
    clienteling: Math.round(
      (dimensionScores.clienteling.total / dimensionScores.clienteling.weight) * 100
    ),
    operations: Math.round(
      (dimensionScores.operations.total / dimensionScores.operations.weight) * 100
    ),
    leadership_signals: Math.round(
      (dimensionScores.leadership_signals.total / dimensionScores.leadership_signals.weight) * 100
    ),
  }

  return scores
}

/**
 * Generate insights from assessment scores
 */
export function generateInsights(scores: AssessmentScores): AssessmentInsights {
  const dimensionLabels: Record<AssessmentDimension, string> = {
    service_excellence: 'Service Excellence',
    clienteling: 'Clienteling',
    operations: 'Operations',
    leadership_signals: 'Leadership',
  }

  // Sort dimensions by score
  const entries = Object.entries(scores) as [AssessmentDimension, number][]
  const sorted = entries.sort((a, b) => b[1] - a[1])

  // Top 2 are strengths
  const strengths = sorted.slice(0, 2).map(([dim]) => dimensionLabels[dim])

  // Bottom 2 are development areas
  const developmentAreas = sorted.slice(-2).map(([dim]) => dimensionLabels[dim])

  // Calculate overall score
  const overall_score = Math.round(
    (scores.service_excellence + scores.clienteling + scores.operations + scores.leadership_signals) / 4
  )

  // Generate recommended paths based on profile
  const recommendedPaths: string[] = []

  // Service + Clienteling strength → Client-facing roles
  if (scores.clienteling >= 75 && scores.service_excellence >= 70) {
    recommendedPaths.push('Client Relationship Specialist')
    recommendedPaths.push('VIC Manager')
    recommendedPaths.push('Personal Stylist')
  }

  // Leadership strength → Management track
  if (scores.leadership_signals >= 70) {
    recommendedPaths.push('Team Lead')
    recommendedPaths.push('Floor Manager')
    if (scores.operations >= 65) {
      recommendedPaths.push('Assistant Store Manager')
    }
  }

  // Operations strength → Operational roles
  if (scores.operations >= 75) {
    recommendedPaths.push('Operations Coordinator')
    recommendedPaths.push('Stock Manager')
    recommendedPaths.push('Visual Merchandiser')
  }

  // Service Excellence strength → Specialist roles
  if (scores.service_excellence >= 80) {
    recommendedPaths.push('Product Specialist')
    recommendedPaths.push('Brand Ambassador')
  }

  // Balanced profile → Generalist roles
  const scoresArray = Object.values(scores)
  const variance = scoresArray.reduce((acc, score) => {
    const diff = score - overall_score
    return acc + diff * diff
  }, 0) / scoresArray.length

  if (variance < 100 && overall_score >= 70) {
    recommendedPaths.push('Store Director Track')
    recommendedPaths.push('Multi-Brand Specialist')
  }

  // Remove duplicates and limit to 5
  const uniquePaths = Array.from(new Set(recommendedPaths)).slice(0, 5)

  return {
    strengths,
    development_areas: developmentAreas,
    recommended_paths: uniquePaths.length > 0 ? uniquePaths : ['Sales Advisor', 'Client Advisor'],
    overall_score,
  }
}

/**
 * Process complete assessment
 */
export function processAssessment(answers: AssessmentAnswers): AssessmentResult {
  const scores = scoreAssessment(answers)
  const insights = generateInsights(scores)

  return {
    scores,
    insights,
    version: ASSESSMENT_VERSION,
  }
}

/**
 * Get dimension display name
 */
export function getDimensionLabel(dimension: AssessmentDimension): string {
  const labels: Record<AssessmentDimension, string> = {
    service_excellence: 'Service Excellence',
    clienteling: 'Clienteling',
    operations: 'Operations',
    leadership_signals: 'Leadership Signals',
  }
  return labels[dimension]
}

/**
 * Get dimension description
 */
export function getDimensionDescription(dimension: AssessmentDimension): string {
  const descriptions: Record<AssessmentDimension, string> = {
    service_excellence: 'Your ability to deliver exceptional client experiences and maintain luxury standards',
    clienteling: 'Your skills in building and maintaining long-term client relationships',
    operations: 'Your competency in managing processes, inventory, and operational excellence',
    leadership_signals: 'Your capacity to influence, mentor, and lead teams effectively',
  }
  return descriptions[dimension]
}

/**
 * Get score interpretation
 */
export function getScoreInterpretation(score: number): {
  level: 'excellent' | 'strong' | 'developing' | 'emerging'
  message: string
} {
  if (score >= 85) {
    return {
      level: 'excellent',
      message: 'Exceptional performance in this area',
    }
  } else if (score >= 70) {
    return {
      level: 'strong',
      message: 'Strong competency demonstrated',
    }
  } else if (score >= 55) {
    return {
      level: 'developing',
      message: 'Good foundation with room for growth',
    }
  } else {
    return {
      level: 'emerging',
      message: 'Area for focused development',
    }
  }
}
