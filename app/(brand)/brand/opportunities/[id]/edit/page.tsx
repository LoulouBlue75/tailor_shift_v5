import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Container } from '@/components/ui/Layout'
import { Button } from '@/components/ui/Button'
import { H1, Text } from '@/components/ui/Typography'
import { OpportunityForm } from '@/components/brand/OpportunityForm'

async function getOpportunityAndStores(id: string) {
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

  // Get all stores for the dropdown
  const { data: stores } = await supabase
    .from('stores')
    .select('id, name, city')
    .eq('brand_id', brand.id)
    .eq('status', 'active')
    .order('name')

  return {
    opportunity,
    stores: stores || [],
  }
}

export default async function EditOpportunityPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  const { opportunity, stores } = await getOpportunityAndStores(resolvedParams.id)

  return (
    <Container size="xl">
      <div className="py-8">
        <div className="mb-6">
          <Link href={`/brand/opportunities/${resolvedParams.id}`}>
            <Button variant="secondary">← Back to Opportunity</Button>
          </Link>
        </div>

        <H1 className="mb-2">Edit Opportunity</H1>
        <Text variant="body" className="text-soft-grey mb-8">
          Update the details of your opportunity
        </Text>

        <OpportunityForm
          mode="edit"
          opportunityId={resolvedParams.id}
          initialData={opportunity}
          stores={stores}
        />
      </div>
    </Container>
  )
}
