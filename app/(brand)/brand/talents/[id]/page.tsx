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

async function getTalentProfile(talentId: string, opportunityId?: string) {
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

  // Get talent with experience blocks
  const { data: talent } = await supabase
    .from('talents')
    .select(`
      *,
      experience_blocks (*)
    `)
    .eq('id', talentId)
    .single()

  if (!talent) {
    redirect('/brand/opportunities')
  }

  // If opportunity ID provided, get the match
  let match = null
  if (opportunityId) {
    const { data: matchData } = await supabase
      .from('matches')
      .select(`
        *,
        opportunities:opportunity_id (
          id,
          title
        )
      `)
      .eq('talent_id', talentId)
      .eq('opportunity_id', opportunityId)
      .single()

    match = matchData
  }

  return { talent, match }
}

export default async function TalentProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ opportunity?: string }>
}) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const { talent, match } = await getTalentProfile(resolvedParams.id, resolvedSearchParams.opportunity)

  return (
    <Container size="xl">
      <div className="py-8">
        <div className="mb-6">
          {resolvedSearchParams.opportunity ? (
            <Link href={`/brand/opportunities/${resolvedSearchParams.opportunity}/matches`}>
              <Button variant="secondary">← Back to Matches</Button>
            </Link>
          ) : (
            <Link href="/brand/opportunities">
              <Button variant="secondary">← Back to Opportunities</Button>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <div>
              <H1 className="mb-2">
                {talent.first_name} {talent.last_name}
              </H1>
              <div className="flex items-center gap-3 text-soft-grey mb-4">
                <span>
                  {talent.current_role_level} • {talent.current_store_tier}
                </span>
                {talent.current_location && <span>• {talent.current_location}</span>}
                <span>• {talent.years_in_luxury} years in luxury</span>
              </div>
              {talent.current_maison && (
                <Text variant="body" className="text-soft-grey">
                  Currently at {talent.current_maison}
                </Text>
              )}
            </div>

            {/* Divisions Expertise */}
            <Card variant="default" className="p-6">
              <H3 className="mb-4">Division Expertise</H3>
              <div className="flex flex-wrap gap-2">
                {talent.divisions_expertise?.map((div: string) => (
                  <Badge key={div}>{div.replace(/_/g, ' ')}</Badge>
                ))}
              </div>
            </Card>

            {/* Assessment Summary */}
            {talent.assessment_summary && (
              <Card variant="default" className="p-6">
                <H3 className="mb-4">Retail Excellence Assessment</H3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Text variant="caption" className="text-soft-grey mb-1">
                      Service Excellence
                    </Text>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold">
                        {talent.assessment_summary.service_excellence}
                      </div>
                      <Text variant="caption" className="text-soft-grey">
                        / 100
                      </Text>
                    </div>
                  </div>
                  <div>
                    <Text variant="caption" className="text-soft-grey mb-1">
                      Clienteling
                    </Text>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold">
                        {talent.assessment_summary.clienteling}
                      </div>
                      <Text variant="caption" className="text-soft-grey">
                        / 100
                      </Text>
                    </div>
                  </div>
                  <div>
                    <Text variant="caption" className="text-soft-grey mb-1">
                      Operations
                    </Text>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold">
                        {talent.assessment_summary.operations}
                      </div>
                      <Text variant="caption" className="text-soft-grey">
                        / 100
                      </Text>
                    </div>
                  </div>
                  <div>
                    <Text variant="caption" className="text-soft-grey mb-1">
                      Leadership Signals
                    </Text>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold">
                        {talent.assessment_summary.leadership_signals}
                      </div>
                      <Text variant="caption" className="text-soft-grey">
                        / 100
                      </Text>
                    </div>
                  </div>
                </div>
                <Text variant="caption" className="text-soft-grey">
                  Completed on{' '}
                  {new Date(talent.assessment_summary.completed_at).toLocaleDateString()}
                </Text>
              </Card>
            )}

            {/* Experience Blocks */}
            {talent.experience_blocks && talent.experience_blocks.length > 0 && (
              <Card variant="default" className="p-6">
                <H3 className="mb-4">Experience</H3>
                <div className="space-y-4">
                  {talent.experience_blocks.map((block: any) => (
                    <div key={block.id} className="border-l-2 border-matte-gold pl-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <H3 className="text-lg">{block.title}</H3>
                          <Text variant="body" className="text-soft-grey">
                            {block.company}
                          </Text>
                        </div>
                        <Badge>{block.block_type}</Badge>
                      </div>
                      <Text variant="caption" className="text-soft-grey mb-2">
                        {new Date(block.start_date).toLocaleDateString()} -{' '}
                        {block.is_current
                          ? 'Present'
                          : new Date(block.end_date).toLocaleDateString()}
                      </Text>
                      {block.achievements && block.achievements.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {block.achievements.map((achievement: string, idx: number) => (
                            <li key={idx} className="flex gap-2 text-sm">
                              <span className="text-matte-gold">•</span>
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Career Preferences */}
            {talent.career_preferences && (
              <Card variant="default" className="p-6">
                <H3 className="mb-4">Career Preferences</H3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Text variant="label" className="text-soft-grey mb-2">
                      Target Role Levels
                    </Text>
                    <div className="flex flex-wrap gap-2">
                      {talent.career_preferences.target_role_levels?.map((level: string) => (
                        <Badge key={level}>{level}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Text variant="label" className="text-soft-grey mb-2">
                      Mobility
                    </Text>
                    <Badge>{talent.career_preferences.mobility?.replace(/_/g, ' ')}</Badge>
                  </div>
                  <div>
                    <Text variant="label" className="text-soft-grey mb-2">
                      Timeline
                    </Text>
                    <Badge>
                      {talent.career_preferences.timeline === 'active'
                        ? 'Actively Looking'
                        : talent.career_preferences.timeline === 'passive'
                        ? 'Open to Opportunities'
                        : 'Not Looking'}
                    </Badge>
                  </div>
                  {talent.career_preferences.target_locations &&
                    talent.career_preferences.target_locations.length > 0 && (
                      <div>
                        <Text variant="label" className="text-soft-grey mb-2">
                          Target Locations
                        </Text>
                        <div className="flex flex-wrap gap-2">
                          {talent.career_preferences.target_locations.map((loc: string) => (
                            <Badge key={loc}>{loc}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Match Score (if viewing from opportunity context) */}
            {match && (
              <>
                <Card variant="default" className="p-6 bg-gradient-to-br from-matte-gold/10 to-white">
                  <H3 className="mb-2">Match Score</H3>
                  <div className="text-5xl font-bold text-charcoal mb-2">
                    {match.score_total}%
                  </div>
                  <Text variant="caption" className="text-soft-grey mb-4">
                    For: {match.opportunities?.title}
                  </Text>
                  <CompensationBadge alignment={match.compensation_alignment} />
                </Card>

                <Card variant="default" className="p-6">
                  <H3 className="mb-4">Match Breakdown</H3>
                  <ScoreBreakdown scores={match.score_breakdown} />
                </Card>
              </>
            )}

            {/* Actions */}
            <Card variant="default" className="p-6">
              <Button variant="primary" className="w-full mb-3" disabled>
                Express Interest
              </Button>
              <Button variant="secondary" className="w-full mb-3">
                Save Candidate
              </Button>
              <Text variant="caption" className="text-soft-grey block text-center">
                Interest feature coming soon
              </Text>
            </Card>

            {/* Privacy Note */}
            <Card variant="default" className="p-6 bg-blue-50">
              <H3 className="mb-2 text-sm">Privacy Notice</H3>
              <Text variant="caption" className="text-soft-grey">
                Compensation expectations are never disclosed. Contact information is shared
                only after mutual interest is expressed.
              </Text>
            </Card>
          </div>
        </div>
      </div>
    </Container>
  )
}
