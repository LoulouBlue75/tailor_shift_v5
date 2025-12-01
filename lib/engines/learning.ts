/**
 * Learning Recommendation Engine
 * Recommends modules based on assessment gaps and role level
 */

import { Talent } from '@/lib/supabase/database.types'
import { LearningModule } from '@/data/learning/modules'

export interface LearningRecommendation {
  module: LearningModule
  reason: string
  priority: number
}

interface ProgressRecord {
  module_id: string
  status: string
}

/**
 * Get recommended learning modules for a talent based on assessment gaps
 */
export function getRecommendedModules(
  talent: Talent,
  allModules: LearningModule[],
  progressRecords: ProgressRecord[] = []
): LearningRecommendation[] {
  const assessmentScores = talent.assessment_summary || {}
  const currentLevel = talent.current_role_level

  // 1. Identify gaps (scores < 60)
  const gaps: Array<{ dimension: string; score: number; severity: number }> = []

  if (assessmentScores.service_excellence !== undefined && assessmentScores.service_excellence !== null) {
    const score = assessmentScores.service_excellence
    if (score < 60) {
      gaps.push({
        dimension: 'service_excellence',
        score,
        severity: 60 - score,
      })
    }
  }

  if (assessmentScores.clienteling !== undefined && assessmentScores.clienteling !== null) {
    const score = assessmentScores.clienteling
    if (score < 60) {
      gaps.push({
        dimension: 'clienteling',
        score,
        severity: 60 - score,
      })
    }
  }

  if (assessmentScores.operations !== undefined && assessmentScores.operations !== null) {
    const score = assessmentScores.operations
    if (score < 60) {
      gaps.push({
        dimension: 'operations',
        score,
        severity: 60 - score,
      })
    }
  }

  if (assessmentScores.leadership_signals !== undefined && assessmentScores.leadership_signals !== null) {
    const score = assessmentScores.leadership_signals
    if (score < 60) {
      gaps.push({
        dimension: 'leadership_signals',
        score,
        severity: 60 - score,
      })
    }
  }

  // Sort gaps by severity (highest first)
  gaps.sort((a, b) => b.severity - a.severity)

  // 2. Filter completed modules
  const completedModuleIds = progressRecords
    .filter((p) => p.status === 'completed')
    .map((p) => p.module_id)

  const availableModules = allModules.filter(
    (m) => !completedModuleIds.includes(m.id)
  )

  // 3. Match modules to gaps
  let recommended: LearningRecommendation[] = []

  if (gaps.length > 0) {
    // For talents with gaps, recommend modules targeting those gaps
    for (const gap of gaps) {
      const matchingModules = availableModules.filter((module) =>
        module.target_gaps.includes(gap.dimension)
      )

      // Filter by role level if available
      const roleLevelFiltered = currentLevel
        ? matchingModules.filter((m) =>
            m.target_role_levels.includes(currentLevel)
          )
        : matchingModules

      // Use role-filtered if available, otherwise use all matching
      const modulesToAdd = roleLevelFiltered.length > 0
        ? roleLevelFiltered
        : matchingModules

      for (const learningModule of modulesToAdd) {
        recommended.push({
          module: learningModule,
          reason: `Strengthen your ${formatDimension(gap.dimension)} skills`,
          priority: gap.severity,
        })
      }
    }
  } else {
    // No gaps - high performer, recommend advanced modules
    const advancedModules = availableModules.filter(
      (m) => m.difficulty === 'advanced'
    )

    const roleLevelFiltered = currentLevel
      ? advancedModules.filter((m) =>
          m.target_role_levels.includes(currentLevel)
        )
      : advancedModules

    const modulesToAdd = roleLevelFiltered.length > 0
      ? roleLevelFiltered
      : advancedModules

    recommended = modulesToAdd.map((module) => ({
      module,
      reason: 'Recommended for your high performance level',
      priority: 50,
    }))
  }

  // If still no recommendations, suggest based on role level
  if (recommended.length === 0 && currentLevel) {
    const roleBasedModules = availableModules.filter((m) =>
      m.target_role_levels.includes(currentLevel)
    )

    recommended = roleBasedModules.map((module) => ({
      module,
      reason: 'Relevant for your role level',
      priority: 30,
    }))
  }

  // If still no recommendations, suggest general modules
  if (recommended.length === 0) {
    recommended = availableModules
      .filter((m) => m.difficulty === 'beginner')
      .map((module) => ({
        module,
        reason: 'Build your foundation',
        priority: 20,
      }))
  }

  // Sort by priority and remove duplicates
  const uniqueRecommendations = Array.from(
    new Map(recommended.map((r) => [r.module.id, r])).values()
  )

  uniqueRecommendations.sort((a, b) => b.priority - a.priority)

  // Return top 5
  return uniqueRecommendations.slice(0, 5)
}

/**
 * Format dimension name for display
 */
function formatDimension(dimension: string): string {
  const labels: Record<string, string> = {
    service_excellence: 'Service Excellence',
    clienteling: 'Clienteling',
    operations: 'Operations',
    leadership_signals: 'Leadership',
  }
  return labels[dimension] || dimension
}

/**
 * Group modules by category
 */
export function groupModulesByCategory(
  modules: LearningModule[]
): Record<string, LearningModule[]> {
  return modules.reduce((acc, module) => {
    if (!acc[module.category]) {
      acc[module.category] = []
    }
    acc[module.category].push(module)
    return acc
  }, {} as Record<string, LearningModule[]>)
}

/**
 * Format category name for display
 */
export function formatCategory(category: string): string {
  return category
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
