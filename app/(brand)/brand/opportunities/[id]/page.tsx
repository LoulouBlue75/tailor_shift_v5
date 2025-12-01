import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Container } from '@/components/ui/Layout'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { H1, H2, H3, Text } from '@/components/ui/Typography'
import { Badge } from '@/components/ui/Badge'
import { OpportunityActions } from '@/components/brand/OpportunityActions'

async function getOpportunity(id: string) {
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

  const { data: opportunity } = await supabase
    .from('opportunities')
    .select(`
      *,
      stores:store_id (
        id,
        name,
        city,
        tier
      )
    `)
    .eq('id', id)
    .eq('brand_id', brand.id)
    .single()

  if (!opportunity) {
    redirect('/brand/opportunities')
  }

  return opportunity
}

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case 'active':
      return 'success'
    case 'draft':
      return 'default'
    case 'paused':
      return 'warning'
    case 'filled':
      return 'info'
    case 'cancelled':
      return 'error'
    default:
      return 'default'
  }
}

function formatDate(dateString: string | null) {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  const opportunity = await getOpportunity(resolvedParams.id)

  return (
    <Container size="xl">
      <div className="py-8">
        <div className="mb-6">
          <Link href="/brand/opportunities">
            <Button variant="secondary">← Back to Opportunities</Button>
          </Link>
        </div>

        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <H1>{opportunity.title}</H1>
              <Badge variant={getStatusBadgeVariant(opportunity.status)}>
                {opportunity.status}
              </Badge>
            </div>
            <Text variant="body" className="text-soft-grey">
              {opportunity.stores?.name
                ? `${opportunity.stores.name} - ${opportunity.stores.city}`
                : 'Brand-level position'}
            </Text>
          </div>

          <div className="flex gap-2">
            <Link href={`/brand/opportunities/${resolvedParams.id}/edit`}>
              <Button variant="secondary">Edit</Button>
            </Link>
            <OpportunityActions
              opportunityId={resolvedParams.id}
              status={opportunity.status}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Overview */}
            <Card variant="default" className="p-6">
              <H3 className="mb-4">Overview</H3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Text variant="caption" className="text-soft-grey mb-1">
                    Role Level
                  </Text>
                  <Badge>{opportunity.role_level}</Badge>
                </div>
                {opportunity.division && (
                  <div>
                    <Text variant="caption" className="text-soft-grey mb-1">
                      Division
                    </Text>
                    <Badge>{opportunity.division.replace(/_/g, ' ')}</Badge>
                  </div>
                )}
                <div>
                  <Text variant="caption" className="text-soft-grey mb-1">
                    Required Experience
                  </Text>
                  <Text variant="body">
                    {opportunity.required_experience_years || 0}+ years
                  </Text>
                </div>
                <div>
                  <Text variant="caption" className="text-soft-grey mb-1">
                    Published Date
                  </Text>
                  <Text variant="body">{formatDate(opportunity.published_at)}</Text>
                </div>
              </div>
            </Card>

            {/* Description */}
            <Card variant="default" className="p-6">
              <H3 className="mb-4">Description</H3>
              <Text variant="body" className="whitespace-pre-wrap">
                {opportunity.description}
              </Text>
            </Card>

            {/* Responsibilities */}
            <Card variant="default" className="p-6">
              <H3 className="mb-4">Key Responsibilities</H3>
              <ul className="space-y-2">
                {opportunity.responsibilities?.map((resp: string, index: number) => (
                  <li key={index} className="flex gap-2">
                    <span className="text-matte-gold">•</span>
                    <Text variant="body">{resp}</Text>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Requirements */}
            <Card variant="default" className="p-6">
              <H3 className="mb-4">Requirements</H3>
              <div className="space-y-4">
                {opportunity.required_languages?.length > 0 && (
                  <div>
                    <Text variant="caption" className="text-soft-grey mb-2">
                      Languages
                    </Text>
                    <div className="flex flex-wrap gap-2">
                      {opportunity.required_languages.map((lang: string) => (
                        <Badge key={lang}>{lang}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {opportunity.required_skills?.length > 0 && (
                  <div>
                    <Text variant="caption" className="text-soft-grey mb-2">
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
            {opportunity.benefits?.length > 0 && (
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
            {/* Internal Info */}
            <Card variant="default" className="p-6 bg-blue-50">
              <H3 className="mb-2">Internal Only</H3>
              <Text variant="caption" className="text-soft-grey mb-4">
                This information is never shown to candidates
              </Text>
              {opportunity.compensation_range?.min_base ||
              opportunity.compensation_range?.max_base ? (
                <div className="space-y-3">
                  <div>
                    <Text variant="caption" className="text-soft-grey mb-1">
                      Compensation Range
                    </Text>
                    <Text variant="body" className="font-medium">
                      {opportunity.compensation_range.currency}{' '}
                      {opportunity.compensation_range.min_base?.toLocaleString() || 'N/A'} -{' '}
                      {opportunity.compensation_range.max_base?.toLocaleString() || 'N/A'}
                    </Text>
                  </div>
                  {opportunity.compensation_range.variable_pct && (
                    <div>
                      <Text variant="caption" className="text-soft-grey mb-1">
                        Variable Component
                      </Text>
                      <Text variant="body">{opportunity.compensation_range.variable_pct}%</Text>
                    </div>
                  )}
                </div>
              ) : (
                <Text variant="body" className="text-soft-grey">
                  No compensation range set
                </Text>
              )}
            </Card>

            {/* Matches - Placeholder for STORY-012 */}
            {opportunity.status === 'active' && (
              <Card variant="default" className="p-6">
                <H3 className="mb-4">Matches</H3>
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-soft-grey rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <Text variant="body" className="text-soft-grey">
                    No matches yet
                  </Text>
                  <Text variant="caption" className="text-soft-grey">
                    Matching engine coming soon
                  </Text>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Container>
  )
}
