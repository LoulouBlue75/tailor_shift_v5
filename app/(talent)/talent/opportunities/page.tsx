import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Container } from '@/components/ui/Layout'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { H1, H3, Text } from '@/components/ui/Typography'
import { Badge } from '@/components/ui/Badge'
import { ScoreBreakdown } from '@/components/matching/ScoreBreakdown'
import { CompensationBadge } from '@/components/matching/CompensationBadge'

async function getMatches(scoreFilter?: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: talent } = await supabase
    .from('talents')
    .select('id, onboarding_completed')
    .eq('profile_id', user.id)
    .single()

  if (!talent) {
    redirect('/talent/onboarding')
  }

  let query = supabase
    .from('matches')
    .select(`
      *,
      opportunities:opportunity_id (
        id,
        title,
        role_level,
        division,
        description,
        brands:brand_id (
          id,
          name
        ),
        stores:store_id (
          id,
          name,
          city,
          tier
        )
      )
    `)
    .eq('talent_id', talent.id)
    .eq('status', 'suggested')
    .order('score_total', { ascending: false })

  // Apply score filter
  if (scoreFilter === 'high') {
    query = query.gte('score_total', 80)
  } else if (scoreFilter === 'medium') {
    query = query.gte('score_total', 60).lt('score_total', 80)
  }

  const { data: matches } = await query

  return {
    matches: matches || [],
    talentCompleted: talent.onboarding_completed,
  }
}

export default async function TalentOpportunitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ score?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const { matches, talentCompleted } = await getMatches(resolvedSearchParams.score)

  return (
    <Container size="xl">
      <div className="py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <H1 className="mb-2">Opportunities for You</H1>
            <Text variant="body" className="text-soft-grey">
              {matches.length} opportunities matched to your profile
            </Text>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 border-b border-concrete pb-4">
          <Link href="/talent/opportunities">
            <Button
              variant={!resolvedSearchParams.score ? 'primary' : 'secondary'}
              className="rounded-full"
            >
              All ({matches.length})
            </Button>
          </Link>
          <Link href="/talent/opportunities?score=high">
            <Button
              variant={resolvedSearchParams.score === 'high' ? 'primary' : 'secondary'}
              className="rounded-full"
            >
              High Match (80%+)
            </Button>
          </Link>
          <Link href="/talent/opportunities?score=medium">
            <Button
              variant={resolvedSearchParams.score === 'medium' ? 'primary' : 'secondary'}
              className="rounded-full"
            >
              Medium Match (60-80%)
            </Button>
          </Link>
        </div>

        {/* Empty State */}
        {matches.length === 0 ? (
          <Card variant="interactive" className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-soft-grey rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎯</span>
              </div>
              <H3 className="mb-2">No Opportunities Yet</H3>
              <Text variant="body" className="text-soft-grey mb-6">
                {!talentCompleted
                  ? 'Complete your profile and take the assessment to unlock personalized opportunities.'
                  : 'We\'re actively matching you with relevant opportunities. Check back soon!'}
              </Text>
              {!talentCompleted && (
                <Link href="/talent/onboarding">
                  <Button variant="primary">Complete Profile</Button>
                </Link>
              )}
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {matches.map((match: any) => (
              <Card key={match.id} variant="interactive" className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <Link href={`/talent/opportunities/${match.opportunities.id}`}>
                      <H3 className="hover:text-matte-gold transition-colors cursor-pointer mb-2">
                        {match.opportunities.title}
                      </H3>
                    </Link>
                    <div className="flex items-center gap-2 text-sm text-soft-grey mb-3">
                      <span>
                        {match.opportunities.stores?.city || 'Multiple Locations'} •{' '}
                        {match.opportunities.role_level}
                      </span>
                    </div>
                    <div className="flex gap-2 mb-4">
                      {match.opportunities.division && (
                        <Badge>{match.opportunities.division.replace(/_/g, ' ')}</Badge>
                      )}
                      <Badge variant="success">{match.score_total}% match</Badge>
                      <CompensationBadge alignment={match.compensation_alignment} />
                    </div>
                    <Text variant="body" className="text-soft-grey line-clamp-2 mb-4">
                      {match.opportunities.description}
                    </Text>
                  </div>
                </div>

                <ScoreBreakdown scores={match.score_breakdown} compact />

                <div className="mt-4 pt-4 border-t border-concrete flex gap-2">
                  <Link href={`/talent/opportunities/${match.opportunities.id}`}>
                    <Button variant="primary" size="sm">
                      View Details
                    </Button>
                  </Link>
                  <Button variant="secondary" size="sm" disabled>
                    Express Interest
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Container>
  )
}
