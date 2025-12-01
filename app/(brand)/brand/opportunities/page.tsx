import { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Container } from '@/components/ui/Layout'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { H1, H3, Text } from '@/components/ui/Typography'
import { Badge } from '@/components/ui/Badge'
import { OpportunityStatus } from '@/lib/supabase/database.types'

async function getOpportunities(status?: OpportunityStatus) {
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
    return []
  }

  let query = supabase
    .from('opportunities')
    .select(`
      *,
      stores:store_id (
        id,
        name,
        city
      )
    `)
    .eq('brand_id', brand.id)
    .order('created_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  const { data: opportunities } = await query

  return opportunities || []
}

function getStatusBadgeVariant(status: OpportunityStatus) {
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
    month: 'short',
    day: 'numeric',
  })
}

export default async function OpportunitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: OpportunityStatus }>
}) {
  const resolvedSearchParams = await searchParams
  const opportunities = await getOpportunities(resolvedSearchParams.status)

  const statusCounts = {
    all: opportunities.length,
    active: opportunities.filter((o: { status: string }) => o.status === 'active').length,
    draft: opportunities.filter((o: { status: string }) => o.status === 'draft').length,
    paused: opportunities.filter((o: { status: string }) => o.status === 'paused').length,
    filled: opportunities.filter((o: { status: string }) => o.status === 'filled').length,
  }

  return (
    <Container size="xl">
      <div className="py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <H1 className="mb-2">Opportunities</H1>
            <Text variant="body" className="text-soft-grey">
              Manage your open positions and opportunities
            </Text>
          </div>
          <Link href="/brand/opportunities/new">
            <Button variant="primary">+ Create Opportunity</Button>
          </Link>
        </div>

        {/* Status Filters */}
        <div className="flex gap-2 mb-6 border-b border-concrete pb-4">
          <Link href="/brand/opportunities">
            <Button
              variant={!resolvedSearchParams.status ? 'primary' : 'secondary'}
              className="rounded-full"
            >
              All ({statusCounts.all})
            </Button>
          </Link>
          <Link href="/brand/opportunities?status=active">
            <Button
              variant={resolvedSearchParams.status === 'active' ? 'primary' : 'secondary'}
              className="rounded-full"
            >
              Active ({statusCounts.active})
            </Button>
          </Link>
          <Link href="/brand/opportunities?status=draft">
            <Button
              variant={resolvedSearchParams.status === 'draft' ? 'primary' : 'secondary'}
              className="rounded-full"
            >
              Draft ({statusCounts.draft})
            </Button>
          </Link>
          <Link href="/brand/opportunities?status=paused">
            <Button
              variant={resolvedSearchParams.status === 'paused' ? 'primary' : 'secondary'}
              className="rounded-full"
            >
              Paused ({statusCounts.paused})
            </Button>
          </Link>
          <Link href="/brand/opportunities?status=filled">
            <Button
              variant={resolvedSearchParams.status === 'filled' ? 'primary' : 'secondary'}
              className="rounded-full"
            >
              Filled ({statusCounts.filled})
            </Button>
          </Link>
        </div>

        {/* Opportunities List */}
        {opportunities.length === 0 ? (
          <Card variant="interactive" className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-soft-grey rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📋</span>
              </div>
              <H3 className="mb-2">No opportunities found</H3>
              <Text variant="body" className="text-soft-grey mb-6">
                {resolvedSearchParams.status
                  ? `You don't have any ${resolvedSearchParams.status} opportunities yet.`
                  : "You haven't created any opportunities yet. Start by creating your first one!"}
              </Text>
              <Link href="/brand/opportunities/new">
                <Button variant="primary">Create Your First Opportunity</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {opportunities.map((opportunity: any) => (
              <Card key={opportunity.id} variant="interactive" className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Link href={`/brand/opportunities/${opportunity.id}`}>
                        <H3 className="hover:text-matte-gold transition-colors cursor-pointer">
                          {opportunity.title}
                        </H3>
                      </Link>
                      <Badge variant={getStatusBadgeVariant(opportunity.status)}>
                        {opportunity.status}
                      </Badge>
                      <Badge>{opportunity.role_level}</Badge>
                      {opportunity.division && (
                        <Badge>{opportunity.division.replace(/_/g, ' ')}</Badge>
                      )}
                    </div>

                    <div className="flex gap-6 text-sm text-soft-grey mb-3">
                      <span>
                        📍 {opportunity.stores?.name
                          ? `${opportunity.stores.name} - ${opportunity.stores.city}`
                          : 'Brand-level'}
                      </span>
                      <span>📅 Published: {formatDate(opportunity.published_at)}</span>
                      {opportunity.status === 'active' && (
                        <span>🎯 0 matches</span>
                      )}
                    </div>

                    <Text variant="body" className="text-soft-grey line-clamp-2">
                      {opportunity.description}
                    </Text>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Link href={`/brand/opportunities/${opportunity.id}`}>
                      <Button variant="secondary" size="sm">
                        View
                      </Button>
                    </Link>
                    <Link href={`/brand/opportunities/${opportunity.id}/edit`}>
                      <Button variant="secondary" size="sm">
                        Edit
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Container>
  )
}
