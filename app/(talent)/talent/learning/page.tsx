import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Container } from '@/components/ui/Layout'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { H1, H2, H3, Text } from '@/components/ui/Typography'
import { LearningModuleCard } from '@/components/talent/LearningModuleCard'
import { LEARNING_MODULES } from '@/data/learning/modules'
import {
  getRecommendedModules,
  groupModulesByCategory,
  formatCategory,
} from '@/lib/engines/learning'

async function getLearningData() {
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

  // Get progress records
  const { data: progressRecords } = await supabase
    .from('talent_learning_progress')
    .select('*')
    .eq('talent_id', talent.id)

  return {
    talent,
    progressRecords: progressRecords || [],
  }
}

export default async function LearningPage() {
  const { talent, progressRecords } = await getLearningData()

  const hasAssessment = talent.assessment_summary?.completed_at

  // Get recommendations
  const recommendations = hasAssessment
    ? getRecommendedModules(talent, LEARNING_MODULES, progressRecords)
    : []

  // Group modules by category
  const modulesByCategory = groupModulesByCategory(LEARNING_MODULES)

  // Create progress map for easy lookup
  const progressMap = new Map(
    progressRecords.map((p) => [p.module_id, p])
  )

  return (
    <Container size="xl">
      <div className="py-8">
        <div className="mb-8">
          <H1 className="mb-2">Learning & Development</H1>
          <Text variant="body" className="text-soft-grey">
            Enhance your skills with personalized learning modules
          </Text>
        </div>

        {hasAssessment ? (
          <>
            {/* Recommended Modules */}
            {recommendations.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <H2>Recommended for You</H2>
                  <Text variant="caption" className="text-soft-grey">
                    Based on your assessment results
                  </Text>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.slice(0, 3).map((rec) => (
                    <LearningModuleCard
                      key={rec.module.id}
                      module={rec.module}
                      progress={progressMap.get(rec.module.id)}
                      highlighted
                      reason={rec.reason}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* All Modules by Category */}
            <section>
              <H2 className="mb-6">All Modules</H2>
              <div className="space-y-10">
                {Object.entries(modulesByCategory).map(([category, modules]) => (
                  <div key={category}>
                    <H3 className="mb-4">{formatCategory(category)}</H3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {modules.map((module) => (
                        <LearningModuleCard
                          key={module.id}
                          module={module}
                          progress={progressMap.get(module.id)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : (
          /* Empty State - No Assessment */
          <Card variant="interactive" className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-soft-grey rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📚</span>
              </div>
              <H3 className="mb-2">Complete Your Assessment</H3>
              <Text variant="body" className="text-soft-grey mb-6">
                Take the Retail Excellence Assessment to get personalized learning
                recommendations based on your skill gaps and development areas.
              </Text>
              <Link href="/talent/assessment">
                <Button variant="primary">Start Assessment</Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </Container>
  )
}
