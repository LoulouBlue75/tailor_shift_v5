'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { generateMatchesForOpportunity, rematchOpportunity } from './matching'
import { z } from 'zod'

// ============================================================================
// SCHEMAS
// ============================================================================

const compensationRangeSchema = z.object({
  min_base: z.number().positive().optional().nullable(),
  max_base: z.number().positive().optional().nullable(),
  variable_pct: z.number().min(0).max(100).optional().nullable(),
  currency: z.string().default('EUR'),
}).refine(
  (data) => {
    if (data.min_base && data.max_base) {
      return data.max_base >= data.min_base
    }
    return true
  },
  { message: 'Maximum compensation must be greater than or equal to minimum' }
)

const opportunityFormSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  storeId: z.string().uuid().optional().nullable(),
  roleLevel: z.enum(['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8']),
  division: z.enum([
    'fashion',
    'leather_goods',
    'shoes',
    'beauty',
    'fragrance',
    'watches',
    'high_jewelry',
    'eyewear',
    'accessories',
  ]).optional().nullable(),
  requiredExperienceYears: z.number().int().min(0).optional().nullable(),
  requiredLanguages: z.array(z.string()).default([]),
  requiredSkills: z.array(z.string()).default([]),
  description: z.string().min(100, 'Description must be at least 100 characters').max(2000),
  responsibilities: z.array(z.string()).min(3, 'At least 3 responsibilities required').max(10),
  benefits: z.array(z.string()).default([]),
  compensationRange: compensationRangeSchema.optional().nullable(),
})

type OpportunityFormData = z.infer<typeof opportunityFormSchema>

// ============================================================================
// ACTIONS
// ============================================================================

export async function createOpportunity(
  data: OpportunityFormData,
  status: 'draft' | 'active' = 'draft'
): Promise<{ success: true; opportunityId: string } | { success: false; error: string }> {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Get brand for this user
    const { data: brand, error: brandError } = await supabase
      .from('brands')
      .select('id')
      .eq('profile_id', user.id)
      .single()

    if (brandError || !brand) {
      return { success: false, error: 'Brand not found' }
    }

    // Validate form data
    const validated = opportunityFormSchema.parse(data)

    // Create opportunity
    const { data: opportunity, error: createError } = await supabase
      .from('opportunities')
      .insert({
        brand_id: brand.id,
        store_id: validated.storeId,
        title: validated.title,
        role_level: validated.roleLevel,
        division: validated.division,
        required_experience_years: validated.requiredExperienceYears,
        required_languages: validated.requiredLanguages,
        required_skills: validated.requiredSkills,
        description: validated.description,
        responsibilities: validated.responsibilities,
        benefits: validated.benefits,
        compensation_range: validated.compensationRange || {
          min_base: null,
          max_base: null,
          variable_pct: null,
          currency: 'EUR',
        },
        matching_criteria: {
          min_assessment_scores: {},
          preferred_maisons: [],
          preferred_divisions: [],
          weight_overrides: {},
        },
        status,
        published_at: status === 'active' ? new Date().toISOString() : null,
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating opportunity:', createError)
      return { success: false, error: 'Failed to create opportunity' }
    }

    // Trigger matching engine if status is active
    if (status === 'active') {
      await generateMatchesForOpportunity(opportunity.id)
    }

    revalidatePath('/brand/opportunities')
    return { success: true, opportunityId: opportunity.id }
  } catch (error) {
    console.error('Error in createOpportunity:', error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function updateOpportunity(
  id: string,
  data: OpportunityFormData
) {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Get brand for this user
    const { data: brand, error: brandError } = await supabase
      .from('brands')
      .select('id')
      .eq('profile_id', user.id)
      .single()

    if (brandError || !brand) {
      return { success: false, error: 'Brand not found' }
    }

    // Verify ownership
    const { data: opportunity, error: ownershipError } = await supabase
      .from('opportunities')
      .select('id, brand_id, status')
      .eq('id', id)
      .single()

    if (ownershipError || !opportunity) {
      return { success: false, error: 'Opportunity not found' }
    }

    if (opportunity.brand_id !== brand.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Validate form data
    const validated = opportunityFormSchema.parse(data)

    // Update opportunity
    const { error: updateError } = await supabase
      .from('opportunities')
      .update({
        store_id: validated.storeId,
        title: validated.title,
        role_level: validated.roleLevel,
        division: validated.division,
        required_experience_years: validated.requiredExperienceYears,
        required_languages: validated.requiredLanguages,
        required_skills: validated.requiredSkills,
        description: validated.description,
        responsibilities: validated.responsibilities,
        benefits: validated.benefits,
        compensation_range: validated.compensationRange || {
          min_base: null,
          max_base: null,
          variable_pct: null,
          currency: 'EUR',
        },
      })
      .eq('id', id)

    if (updateError) {
      console.error('Error updating opportunity:', updateError)
      return { success: false, error: 'Failed to update opportunity' }
    }

    // Re-trigger matching if opportunity is active
    if (opportunity.status === 'active') {
      await rematchOpportunity(id)
    }

    revalidatePath('/brand/opportunities')
    revalidatePath(`/brand/opportunities/${id}`)
    return { success: true }
  } catch (error) {
    console.error('Error in updateOpportunity:', error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function updateOpportunityStatus(
  id: string,
  status: 'active' | 'paused' | 'filled' | 'cancelled'
) {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Get brand for this user
    const { data: brand, error: brandError } = await supabase
      .from('brands')
      .select('id')
      .eq('profile_id', user.id)
      .single()

    if (brandError || !brand) {
      return { success: false, error: 'Brand not found' }
    }

    // Verify ownership
    const { data: opportunity, error: ownershipError } = await supabase
      .from('opportunities')
      .select('id, brand_id')
      .eq('id', id)
      .single()

    if (ownershipError || !opportunity) {
      return { success: false, error: 'Opportunity not found' }
    }

    if (opportunity.brand_id !== brand.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Update status
    const updateData: Record<string, any> = { status }

    // Set published_at if transitioning to active
    if (status === 'active') {
      updateData.published_at = new Date().toISOString()
    }

    // Set filled_at if marking as filled
    if (status === 'filled') {
      updateData.filled_at = new Date().toISOString()
    }

    const { error: updateError } = await supabase
      .from('opportunities')
      .update(updateData)
      .eq('id', id)

    if (updateError) {
      console.error('Error updating opportunity status:', updateError)
      return { success: false, error: 'Failed to update status' }
    }

    // Trigger or remove matches based on status
    if (status === 'active') {
      await generateMatchesForOpportunity(id)
    }

    revalidatePath('/brand/opportunities')
    revalidatePath(`/brand/opportunities/${id}`)
    return { success: true }
  } catch (error) {
    console.error('Error in updateOpportunityStatus:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function deleteOpportunity(id: string) {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Get brand for this user
    const { data: brand, error: brandError } = await supabase
      .from('brands')
      .select('id')
      .eq('profile_id', user.id)
      .single()

    if (brandError || !brand) {
      return { success: false, error: 'Brand not found' }
    }

    // Verify ownership and check status
    const { data: opportunity, error: ownershipError } = await supabase
      .from('opportunities')
      .select('id, brand_id, status')
      .eq('id', id)
      .single()

    if (ownershipError || !opportunity) {
      return { success: false, error: 'Opportunity not found' }
    }

    if (opportunity.brand_id !== brand.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Only allow deletion of draft or filled opportunities
    if (opportunity.status !== 'draft' && opportunity.status !== 'filled') {
      return { 
        success: false, 
        error: 'Only draft or filled opportunities can be deleted' 
      }
    }

    // Delete opportunity (CASCADE will handle matches)
    const { error: deleteError } = await supabase
      .from('opportunities')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Error deleting opportunity:', deleteError)
      return { success: false, error: 'Failed to delete opportunity' }
    }

    revalidatePath('/brand/opportunities')
    return { success: true }
  } catch (error) {
    console.error('Error in deleteOpportunity:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function getOpportunities(statusFilter?: string) {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: 'Not authenticated', opportunities: [] }
    }

    // Get brand for this user
    const { data: brand, error: brandError } = await supabase
      .from('brands')
      .select('id')
      .eq('profile_id', user.id)
      .single()

    if (brandError || !brand) {
      return { success: false, error: 'Brand not found', opportunities: [] }
    }

    // Build query
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

    // Apply status filter if provided
    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('status', statusFilter)
    }

    const { data: opportunities, error: fetchError } = await query

    if (fetchError) {
      console.error('Error fetching opportunities:', fetchError)
      return { success: false, error: 'Failed to fetch opportunities', opportunities: [] }
    }

    return { success: true, opportunities: opportunities || [] }
  } catch (error) {
    console.error('Error in getOpportunities:', error)
    return { success: false, error: 'An unexpected error occurred', opportunities: [] }
  }
}

export async function getOpportunity(id: string) {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: 'Not authenticated', opportunity: null }
    }

    // Get brand for this user
    const { data: brand, error: brandError } = await supabase
      .from('brands')
      .select('id')
      .eq('profile_id', user.id)
      .single()

    if (brandError || !brand) {
      return { success: false, error: 'Brand not found', opportunity: null }
    }

    // Fetch opportunity with store info
    const { data: opportunity, error: fetchError } = await supabase
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

    if (fetchError) {
      console.error('Error fetching opportunity:', fetchError)
      return { success: false, error: 'Opportunity not found', opportunity: null }
    }

    return { success: true, opportunity }
  } catch (error) {
    console.error('Error in getOpportunity:', error)
    return { success: false, error: 'An unexpected error occurred', opportunity: null }
  }
}
