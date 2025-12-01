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

async function getOpportunityMatch(opportunityId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: talent } = await supabase
    .from('talents')
    .select('id')
    .eq('profile_id', user.id)
    .single()

  if (!talent) {
    redirect('/talent/onboarding')
  }

  // Get the match with full opportunity details
  const { data: match } = await supabase
    .from('matches')
    .select(`
      *,
      opportunities:opportunity_id (
        id,
        title,
        role_level,
        division,
        description,
        responsibilities,
        required_experience_years,
        required_languages,
        required_skills,
        benefits,
        brands:brand_id (
          id,
          name
        ),
        stores:store_id (
          id,
          name,
          city,
          country,
          tier
        )
      )
    `)
    .eq('talent_id', talent.id)
    .eq('opportunity_id', opportunityId)
    .single()

  if (!match) {
    redirect('/talent/opportunities')
  }

  return match
}

export default async function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  const match = await getOpportunityMatch(resolvedParams.id)
  const opportunity = match.opportunities

  return (
    <Container size="xl">
      <div className="py-8">
        <div className="mb-6">
          <Link href="/talent/opportunities">
            <Button variant="secondary">← Back to Opportunities</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <H1 className="mb-2">{opportunity.title}</H1>
                  <div className="flex items-center gap-2 text-soft-grey">
                    <span>
                      {opportunity.stores?.name || 'Brand Position'} •{' '}
                      {opportunity.stores?.city}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mb-6">
                <Badge>{opportunity.role_level}</Badge>
                {opportunity.division && (
                  <Badge>{opportunity.division.replace(/_/g, ' ')}</Badge>
                )}
                {opportunity.stores?.tier && <Badge>Tier {opportunity.stores.tier}</Badge>}
              </div>
            </div>

            {/* Description */}
            <Card variant="default" className="p-6">
              <H3 className="mb-4">About This Role</H3>
              <Text variant="body" className="whitespace-pre-wrap">
                {opportunity.description}
              </Text>
            </Card>

            {/* Responsibilities */}
            {opportunity.responsibilities && opportunity.responsibilities.length > 0 && (
              <Card variant="default" className="p-6">
                <H3 className="mb-4">Key Responsibilities</H3>
                <ul className="space-y-2">
                  {opportunity.responsibilities.map((resp: string, index: number) => (
                    <li key={index} className="flex gap-2">
                      <span className="text-matte-gold">•</span>
                      <Text variant="body">{resp}</Text>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Requirements */}
            <Card variant="default" className="p-6">
              <H3 className="mb-4">Requirements</H3>
              <div className="space-y-4">
                {opportunity.required_experience_years && (
                  <div>
                    <Text variant="label" className="text-soft-grey mb-1">
                      Experience
                    </Text>
                    <Text variant="body">{opportunity.required_experience_years}+ years in luxury retail</Text>
                  </div>
                )}
                {opportunity.required_languages && opportunity.required_languages.length > 0 && (
                  <div>
                    <Text variant="label" className="text-soft-grey mb-2">
                      Languages
                    </Text>
                    <div className="flex flex-wrap gap-2">
                      {opportunity.required_languages.map((lang: string) => (
                        <Badge key={lang}>{lang}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {opportunity.required_skills && opportunity.required_skills.length > 0 && (
                  <div>
                    <Text variant="label" className="text-soft-grey mb-2">
                      Skills
                    </Text>
                    <div className="flex flex-wrap gap-2">
                      {opportunity.required_skills.map((skill: string) => (
                        <Badge key={skill}>{skill}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Benefits */}
            {opportunity.benefits && opportunity.benefits.length > 0 && (
              <Card variant="default" className="p-6">
                <H3 className="mb-4">Benefits</H3>
                <ul className="space-y-2">
                  {opportunity.benefits.map((benefit: string, index: number) => (
                    <li key={index} className="flex gap-2">
                      <span className="text-matte-gold">✓</span>
                      <Text variant="body">{benefit}</Text>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Match Score */}
            <Card variant="default" className="p-6 bg-gradient-to-br from-matte-gold/10 to-white">
              <H3 className="mb-2">Your Match Score</H3>
              <div className="text-5xl font-bold text-charcoal mb-2">
                {match.score_total}%
              </div>
              <Text variant="caption" className="text-soft-grey">
                Excellent fit for this role
              </Text>
            </Card>

            {/* Compensation Alignment */}
            <Card variant="default" className="p-6">
              <H3 className="mb-3">Compensation Alignment</H3>
              <CompensationBadge alignment={match.compensation_alignment} />
              <Text variant="caption" className="text-soft-grey mt-2 block">
                Based on profile alignment. Actual numbers are confidential.
              </Text>
            </Card>

            {/* Score Breakdown */}
            <Card variant="default" className="p-6">
              <H3 className="mb-4">Match Breakdown</H3>
              <ScoreBreakdown scores={match.score_breakdown} />
            </Card>

            {/* Actions */}
            <Card variant="default" className="p-6">
              <Button variant="primary" className="w-full mb-3" disabled>
                Express Interest
              </Button>
              <Button variant="secondary" className="w-full">
                Save for Later
              </Button>
              <Text variant="caption" className="text-soft-grey mt-3 block text-center">
                Interest feature coming soon
              </Text>
            </Card>
          </div>
        </div>
      </div>
    </Container>
  )
}
