/**
 * Career Projection Engine
 * Predicts next career step based on current profile and assessment
 */

import { Talent } from '@/lib/supabase/database.types'

export type ReadinessLevel = 'ready_now' | 'ready_soon' | 'developing'

// Partial talent type with only the fields needed for career projection
export interface ProjectionTalent {
  current_role_level: string | null
  years_in_luxury: number | null
  assessment_summary: {
    service_excellence?: number | null
    clienteling?: number | null
    operations?: number | null
    leadership_signals?: number | null
    completed_at?: string | null
  } | null
}

export interface ProjectionResult {
  current_role: {
    level: string
    title: string
  }
  next_role: {
    level: string
    typical_titles: string[]
    readiness: ReadinessLevel
  }
  timeline_estimate: {
    min_months: number
    max_months: number
  }
  capability_gaps: string[]
  recommended_experiences: string[]
  engine_version: string
}

// Role progression map
const ROLE_PROGRESSION: Record<string, { next: string; titles: string[] }> = {
  L1: { next: 'L2', titles: ['Senior Advisor', 'Expert Advisor'] },
  L2: { next: 'L3', titles: ['Team Lead', 'Floor Manager'] },
  L3: { next: 'L4', titles: ['Department Manager', 'Category Lead'] },
  L4: { next: 'L5', titles: ['Assistant Boutique Director', 'Deputy Manager'] },
  L5: { next: 'L6', titles: ['Boutique Director', 'Store Manager'] },
  L6: { next: 'L7', titles: ['Area Manager', 'District Director'] },
  L7: { next: 'L8', titles: ['Regional Director', 'Country Manager'] },
}

// Current role titles
const ROLE_TITLES: Record<string, string> = {
  L1: 'Advisor',
  L2: 'Senior Advisor',
  L3: 'Team Lead',
  L4: 'Department Manager',
  L5: 'Assistant Director',
  L6: 'Boutique Director',
  L7: 'Area Manager',
  L8: 'Regional Director',
}

// Typical years at each level before promotion
const TYPICAL_YEARS: Record<string, number> = {
  'L1→L2': 2,
  'L2→L3': 3,
  'L3→L4': 3,
  'L4→L5': 4,
  'L5→L6': 5,
  'L6→L7': 6,
  'L7→L8': 8,
}

// Timeline ranges in months
const TIMELINE_RANGES: Record<string, { min: number; max: number }> = {
  'L1→L2': { min: 12, max: 24 },
  'L2→L3': { min: 18, max: 36 },
  'L3→L4': { min: 24, max: 48 },
  'L4→L5': { min: 36, max: 60 },
  'L5→L6': { min: 48, max: 72 },
  'L6→L7': { min: 60, max: 96 },
  'L7→L8': { min: 72, max: 120 },
}

// Score thresholds for next levels
const LEVEL_REQUIREMENTS: Record<string, Record<string, number>> = {
  L2: { service_excellence: 60, clienteling: 65, operations: 55, leadership_signals: 50 },
  L3: { service_excellence: 65, clienteling: 70, operations: 60, leadership_signals: 65 },
  L4: { service_excellence: 70, clienteling: 75, operations: 70, leadership_signals: 70 },
  L5: { service_excellence: 75, clienteling: 75, operations: 75, leadership_signals: 75 },
  L6: { service_excellence: 80, clienteling: 80, operations: 80, leadership_signals: 80 },
  L7: { service_excellence: 80, clienteling: 80, operations: 85, leadership_signals: 85 },
  L8: { service_excellence: 85, clienteling: 85, operations: 85, leadership_signals: 90 },
}

/**
 * Generate career projection for a talent
 */
export function generateCareerProjection(talent: ProjectionTalent | Talent): ProjectionResult {
  const currentLevel = talent.current_role_level || 'L1'
  const progression = ROLE_PROGRESSION[currentLevel]

  // Max level reached
  if (!progression) {
    return {
      current_role: {
        level: currentLevel,
        title: ROLE_TITLES[currentLevel] || 'Executive',
      },
      next_role: {
        level: currentLevel,
        typical_titles: ['Continue strategic leadership development'],
        readiness: 'ready_now',
      },
      timeline_estimate: { min_months: 0, max_months: 0 },
      capability_gaps: [],
      recommended_experiences: [
        'Explore lateral moves or strategic projects',
        'Mentor emerging leaders across the organization',
        'Lead transformational initiatives',
      ],
      engine_version: 'v1.0',
    }
  }

  const readiness = assessReadiness(talent, currentLevel, progression.next)
  const timeline = estimateTimeline(currentLevel, progression.next, readiness)
  const gaps = identifyGaps(talent, progression.next)
  const experiences = recommendExperiences(currentLevel, progression.next, gaps)

  return {
    current_role: {
      level: currentLevel,
      title: ROLE_TITLES[currentLevel] || 'Advisor',
    },
    next_role: {
      level: progression.next,
      typical_titles: progression.titles,
      readiness,
    },
    timeline_estimate: timeline,
    capability_gaps: gaps,
    recommended_experiences: experiences,
    engine_version: 'v1.0',
  }
}

/**
 * Assess readiness for next level
 */
function assessReadiness(
  talent: ProjectionTalent | Talent,
  currentLevel: string,
  nextLevel: string
): ReadinessLevel {
  const yearsInLuxury = talent.years_in_luxury || 0
  const typicalYears = TYPICAL_YEARS[`${currentLevel}→${nextLevel}`] || 3

  const assessmentScores = talent.assessment_summary || {}
  const scores = [
    assessmentScores.service_excellence || 0,
    assessmentScores.clienteling || 0,
    assessmentScores.operations || 0,
    assessmentScores.leadership_signals || 0,
  ]
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length

  // Ready now: exceeds typical years AND high scores
  if (yearsInLuxury >= typicalYears && avgScore >= 70) {
    return 'ready_now'
  }

  // Ready soon: close to typical years OR good scores
  if (yearsInLuxury >= typicalYears * 0.75 && avgScore >= 60) {
    return 'ready_soon'
  }

  // Ready soon: less experience but excellent scores
  if (yearsInLuxury >= typicalYears * 0.5 && avgScore >= 75) {
    return 'ready_soon'
  }

  return 'developing'
}

/**
 * Estimate timeline for promotion
 */
function estimateTimeline(
  currentLevel: string,
  nextLevel: string,
  readiness: ReadinessLevel
): { min_months: number; max_months: number } {
  const range = TIMELINE_RANGES[`${currentLevel}→${nextLevel}`] || { min: 12, max: 24 }

  if (readiness === 'ready_now') {
    return {
      min_months: Math.round(range.min / 2),
      max_months: range.min,
    }
  }
  if (readiness === 'ready_soon') {
    return {
      min_months: range.min,
      max_months: Math.round((range.min + range.max) / 2),
    }
  }
  return {
    min_months: range.max,
    max_months: Math.round(range.max * 1.5),
  }
}

/**
 * Identify capability gaps for next level
 */
function identifyGaps(talent: ProjectionTalent | Talent, nextLevel: string): string[] {
  const gaps: string[] = []
  const scores = talent.assessment_summary || {}
  const requirements = LEVEL_REQUIREMENTS[nextLevel] || {}

  // Check each dimension
  if (
    requirements.service_excellence &&
    (scores.service_excellence || 0) < requirements.service_excellence
  ) {
    gaps.push(
      `Service Excellence: ${scores.service_excellence || 0}/100 → Develop to ${requirements.service_excellence}+ for ${nextLevel}`
    )
  }

  if (
    requirements.clienteling &&
    (scores.clienteling || 0) < requirements.clienteling
  ) {
    gaps.push(
      `Clienteling: ${scores.clienteling || 0}/100 → Develop VIC management to ${requirements.clienteling}+`
    )
  }

  if (
    requirements.operations &&
    (scores.operations || 0) < requirements.operations
  ) {
    gaps.push(
      `Operations: ${scores.operations || 0}/100 → Strengthen operational skills to ${requirements.operations}+`
    )
  }

  if (
    requirements.leadership_signals &&
    (scores.leadership_signals || 0) < requirements.leadership_signals
  ) {
    gaps.push(
      `Leadership: ${scores.leadership_signals || 0}/100 → Develop leadership skills to ${requirements.leadership_signals}+`
    )
  }

  return gaps
}

/**
 * Recommend experiences for career growth
 */
function recommendExperiences(
  currentLevel: string,
  nextLevel: string,
  gaps: string[]
): string[] {
  const experiences: string[] = []

  if (nextLevel === 'L2') {
    experiences.push('Build a VIC client portfolio (20+ clients)')
    experiences.push('Master product knowledge across 2-3 divisions')
    if (gaps.some((g) => g.includes('Clienteling'))) {
      experiences.push('Focus on repeat client relationships and follow-ups')
    }
    experiences.push('Achieve consistent sales targets for 6+ months')
  }

  if (nextLevel === 'L3') {
    experiences.push('Take on informal leadership responsibilities')
    experiences.push('Mentor 1-2 junior advisors')
    experiences.push('Participate in team performance discussions')
    if (gaps.some((g) => g.includes('Leadership'))) {
      experiences.push('Lead floor presence during key retail moments')
    }
  }

  if (nextLevel === 'L4') {
    experiences.push('Manage a category or small department')
    experiences.push('Gain P&L exposure and budget management')
    experiences.push('Lead cross-functional projects')
    if (gaps.some((g) => g.includes('Operations'))) {
      experiences.push('Take ownership of inventory management for a category')
    }
  }

  if (nextLevel === 'L5') {
    experiences.push('Assistant manager role in flagship or full-format store')
    experiences.push('Develop strategic planning skills')
    experiences.push('Build relationships with corporate stakeholders')
    experiences.push('Lead full store opening or closing routines')
  }

  if (nextLevel === 'L6') {
    experiences.push('Full P&L accountability for a store')
    experiences.push('Team hiring and development leadership')
    experiences.push('Strategic client event planning')
    experiences.push('Corporate initiative implementation')
  }

  if (nextLevel === 'L7') {
    experiences.push('Multi-site management experience')
    experiences.push('Regional strategic initiatives')
    experiences.push('Executive-level stakeholder management')
    experiences.push('Market development and expansion projects')
  }

  if (nextLevel === 'L8') {
    experiences.push('National/regional business strategy ownership')
    experiences.push('Board-level presentations and reporting')
    experiences.push('Organizational transformation leadership')
    experiences.push('Industry-wide networking and influence')
  }

  return experiences.slice(0, 5) // Return top 5 recommendations
}

/**
 * Get role title by level
 */
export function getRoleTitle(level: string): string {
  return ROLE_TITLES[level] || 'Retail Professional'
}

/**
 * Get readiness label
 */
export function getReadinessLabel(readiness: ReadinessLevel): string {
  const labels = {
    ready_now: 'Ready Now',
    ready_soon: 'Ready Soon',
    developing: 'Developing',
  }
  return labels[readiness]
}

/**
 * Get readiness description
 */
export function getReadinessDescription(readiness: ReadinessLevel): string {
  const descriptions = {
    ready_now:
      'You have the experience and skills to move to the next level. Focus on visibility and opportunity.',
    ready_soon:
      "You're close to being ready. Continue building experience and addressing capability gaps.",
    developing:
      "You're on the right path. Focus on skill development and gaining relevant experience.",
  }
  return descriptions[readiness]
}
