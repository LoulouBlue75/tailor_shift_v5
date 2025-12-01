import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Container } from '@/components/ui/Layout'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { H1, H2, H3, Text } from '@/components/ui/Typography'
import { Badge } from '@/components/ui/Badge'
import { ScoreBreakdown } from '@/components/matching/ScoreBreakdown'
import { CompensationBadge } from '@/components/matching/CompensationBadge'

async function getOpportunityMatches(opportunityId: string, scoreFilter?: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: brand } = await supabase
    .from('brands')
    .select('id')
    .eq('profile_id', user.id)
    .single()

  if (!brand) {
    redirect('/brand/opportunities')
  }

  // Get opportunity
  const { data: opportunity } = await supabase
    .from('opportunities')
    .select('*')
    .eq('id', opportunityId)
    .eq('brand_id', brand.id)
    .single()

  if (!opportunity) {
    redirect('/brand/opportunities')
  }

  // Get matches
  let query = supabase
    .from('matches')
    .select(`
      *,
      talents:talent_id (
        id,
        first_name,
        last_name,
        current_role_level,
        current_store_tier,
        years_in_luxury,
        current_maison,
        current_location,
        divisions_expertise,
        assessment_summary
      )
    `)
    .eq('opportunity_id', opportunityId)
    .order('score_total', { ascending: false })

  // Apply score filter
  if (scoreFilter === 'high') {
    query = query.gte('score_total', 80)
  } else if (scoreFilter === 'medium') {
    query = query.gte('score_total', 60).lt('score_total', 80)
  }

  const { data: matches } = await query

  return {
    opportunity,
    matches: matches || [],
  }
}

export default async function OpportunityMatchesPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ score?: string }>
}) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const { opportunity, matches } = await getOpportunityMatches(resolvedParams.id, resolvedSearchParams.score)

  return (
    <Container size="xl">
      <div className="py-8">
        <div className="mb-6">
          <Link href={`/brand/opportunities/${resolvedParams.id}`}>
            <Button variant="secondary">← Back to Opportunity</Button>
          </Link>
        </div>

        <div className="mb-8">
          <H1 className="mb-2">Matches for: {opportunity.title}</H1>
          <Text variant="body" className="text-soft-grey">
            {matches.length} qualified talent{matches.length !== 1 ? 's' : ''} matched
          </Text>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 border-b border-concrete pb-4">
          <Link href={`/brand/opportunities/${resolvedParams.id}/matches`}>
            <Button
              variant={!resolvedSearchParams.score ? 'primary' : 'secondary'}
              className="rounded-full"
            >
              All ({matches.length})
            </Button>
          </Link>
          <Link href={`/brand/opportunities/${resolvedParams.id}/matches?score=high`}>
            <Button
              variant={resolvedSearchParams.score === 'high' ? 'primary' : 'secondary'}
              className="rounded-full"
            >
              High Match (80%+)
            </Button>
          </Link>
          <Link href={`/brand/opportunities/${resolvedParams.id}/matches?score=medium`}>
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
                <span className="text-3xl">🔍</span>
              </div>
              <H3 className="mb-2">No Matches Yet</H3>
              <Text variant="body" className="text-soft-grey mb-6">
                We'll notify you when qualified talents are found for this opportunity. The
                matching engine is continuously working to find the best candidates.
              </Text>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {matches.map((match: any) => {
              const talent = match.talents
              return (
                <Card key={match.id} variant="interactive" className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <H3 className="mb-2">
                        {talent.first_name} {talent.last_name}
                      </H3>
                      <div className="flex items-center gap-2 text-sm text-soft-grey mb-3">
                        <span>
                          {talent.current_role_level} • {talent.current_store_tier}
                        </span>
                        {talent.current_location && <span>• {talent.current_location}</span>}
                        <span>• {talent.years_in_luxury} years in luxury</span>
                      </div>

                      <div className="flex gap-2 mb-4">
                        {talent.divisions_expertise?.slice(0, 3).map((div: string) => (
                          <Badge key={div}>{div.replace(/_/g, ' ')}</Badge>
                        ))}
                        <Badge variant="success">{match.score_total}% match</Badge>
                        <CompensationBadge alignment={match.compensation_alignment} />
                      </div>

                      {/* Assessment Summary */}
                      {talent.assessment_summary && (
                        <div className="bg-blue-50 rounded-lg p-3 mb-4">
                          <Text variant="caption" className="text-soft-grey mb-2 block">
                            Assessment Scores
                          </Text>
                          <div className="grid grid-cols-4 gap-3 text-sm">
                            <div>
                              <Text variant="caption" className="text-soft-grey">
                                Service
                              </Text>
                              <Text variant="body" className="font-bold">
                                {talent.assessment_summary.service_excellence}
                              </Text>
                            </div>
                            <div>
                              <Text variant="caption" className="text-soft-grey">
                                Clienteling
                              </Text>
                              <Text variant="body" className="font-bold">
                                {talent.assessment_summary.clienteling}
                              </Text>
                            </div>
                            <div>
                              <Text variant="caption" className="text-soft-grey">
                                Operations
                              </Text>
                              <Text variant="body" className="font-bold">
                                {talent.assessment_summary.operations}
                              </Text>
                            </div>
                            <div>
                              <Text variant="caption" className="text-soft-grey">
                                Leadership
                              </Text>
                              <Text variant="body" className="font-bold">
                                {talent.assessment_summary.leadership_signals}
                              </Text>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <ScoreBreakdown scores={match.score_breakdown} compact />

                  <div className="mt-4 pt-4 border-t border-concrete flex gap-2">
                    <Link href={`/brand/talents/${talent.id}?opportunity=${resolvedParams.id}`}>
                      <Button variant="primary" size="sm">
                        View Profile
                      </Button>
                    </Link>
                    <Button variant="secondary" size="sm" disabled>
                      Express Interest
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </Container>
  )
}
