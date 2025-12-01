'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { calculateMatch, meetsThreshold } from '@/lib/engines/matching'

/**
 * Generate matches for a newly published or updated opportunity
 */
export async function generateMatchesForOpportunity(opportunityId: string) {
  try {
    const supabase = await createClient()

    // Get opportunity with store
    const { data: opportunity, error: oppError } = await supabase
      .from('opportunities')
      .select(`
        *,
        stores:store_id (
          id,
          name,
          city,
          region,
          tier
        )
      `)
      .eq('id', opportunityId)
      .single()

    if (oppError || !opportunity) {
      return { success: false, error: 'Opportunity not found' }
    }

    // Only generate matches for active opportunities
    if (opportunity.status !== 'active') {
      return { success: true, count: 0, message: 'Opportunity not active' }
    }

    // Get all eligible talents (onboarding completed)
    const { data: talents, error: talentsError } = await supabase
      .from('talents')
      .select(`
        *,
        experience_blocks (*)
      `)
      .eq('onboarding_completed', true)

    if (talentsError) {
      return { success: false, error: 'Failed to fetch talents' }
    }

    if (!talents || talents.length === 0) {
      return { success: true, count: 0, message: 'No eligible talents found' }
    }

    // Calculate matches
    const matches = talents
      .map((talent) => {
        const result = calculateMatch(talent, opportunity)
        return {
          talent_id: talent.id,
          opportunity_id: opportunity.id,
          score_total: result.score_total,
          score_breakdown: result.score_breakdown,
          compensation_alignment: result.compensation_alignment,
          engine_version: result.engine_version,
          status: 'suggested' as const,
        }
      })
      .filter((match) => meetsThreshold(match.score_total))

    if (matches.length === 0) {
      return { success: true, count: 0, message: 'No matches above threshold' }
    }

    // Insert matches (upsert to handle re-matching)
    const { error: insertError } = await supabase.from('matches').upsert(matches, {
      onConflict: 'talent_id,opportunity_id',
      ignoreDuplicates: false,
    })

    if (insertError) {
      console.error('Error inserting matches:', insertError)
      return { success: false, error: 'Failed to save matches' }
    }

    revalidatePath('/brand/opportunities/[id]', 'page')

    return { success: true, count: matches.length }
  } catch (error) {
    console.error('Error in generateMatchesForOpportunity:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Generate matches for a talent when they complete onboarding/assessment
 */
export async function generateMatchesForTalent(talentId: string) {
  try {
    const supabase = await createClient()

    // Get talent with experience blocks
    const { data: talent, error: talentError } = await supabase
      .from('talents')
      .select(`
        *,
        experience_blocks (*)
      `)
      .eq('id', talentId)
      .single()

    if (talentError || !talent) {
      return { success: false, error: 'Talent not found' }
    }

    // Only generate matches for completed profiles
    if (!talent.onboarding_completed) {
      return { success: true, count: 0, message: 'Onboarding not completed' }
    }

    // Get all active opportunities
    const { data: opportunities, error: oppsError } = await supabase
      .from('opportunities')
      .select(`
        *,
        stores:store_id (
          id,
          name,
          city,
          region,
          tier
        )
      `)
      .eq('status', 'active')

    if (oppsError) {
      return { success: false, error: 'Failed to fetch opportunities' }
    }

    if (!opportunities || opportunities.length === 0) {
      return { success: true, count: 0, message: 'No active opportunities found' }
    }

    // Calculate matches
    const matches = opportunities
      .map((opportunity) => {
        const result = calculateMatch(talent, opportunity)
        return {
          talent_id: talent.id,
          opportunity_id: opportunity.id,
          score_total: result.score_total,
          score_breakdown: result.score_breakdown,
          compensation_alignment: result.compensation_alignment,
          engine_version: result.engine_version,
          status: 'suggested' as const,
        }
      })
      .filter((match) => meetsThreshold(match.score_total))

    if (matches.length === 0) {
      return { success: true, count: 0, message: 'No matches above threshold' }
    }

    // Insert matches (upsert to handle re-matching)
    const { error: insertError } = await supabase.from('matches').upsert(matches, {
      onConflict: 'talent_id,opportunity_id',
      ignoreDuplicates: false,
    })

    if (insertError) {
      console.error('Error inserting matches:', insertError)
      return { success: false, error: 'Failed to save matches' }
    }

    revalidatePath('/talent/dashboard')

    return { success: true, count: matches.length }
  } catch (error) {
    console.error('Error in generateMatchesForTalent:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Delete and regenerate matches for an opportunity (for re-matching)
 */
export async function rematchOpportunity(opportunityId: string) {
  try {
    const supabase = await createClient()

    // Delete existing matches
    const { error: deleteError } = await supabase
      .from('matches')
      .delete()
      .eq('opportunity_id', opportunityId)

    if (deleteError) {
      console.error('Error deleting matches:', deleteError)
      return { success: false, error: 'Failed to delete old matches' }
    }

    // Generate new matches
    return await generateMatchesForOpportunity(opportunityId)
  } catch (error) {
    console.error('Error in rematchOpportunity:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Delete and regenerate matches for a talent (for re-matching)
 */
export async function rematchTalent(talentId: string) {
  try {
    const supabase = await createClient()

    // Delete existing matches
    const { error: deleteError } = await supabase
      .from('matches')
      .delete()
      .eq('talent_id', talentId)

    if (deleteError) {
      console.error('Error deleting matches:', deleteError)
      return { success: false, error: 'Failed to delete old matches' }
    }

    // Generate new matches
    return await generateMatchesForTalent(talentId)
  } catch (error) {
    console.error('Error in rematchTalent:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Get match count for an opportunity (for brand dashboard)
 */
export async function getOpportunityMatchCount(opportunityId: string) {
  try {
    const supabase = await createClient()

    const { count, error } = await supabase
      .from('matches')
      .select('*', { count: 'exact', head: true })
      .eq('opportunity_id', opportunityId)
      .gte('score_total', 40)

    if (error) {
      return { success: false, count: 0 }
    }

    return { success: true, count: count || 0 }
  } catch (error) {
    return { success: false, count: 0 }
  }
}

/**
 * Get match count for a talent (for talent dashboard)
 */
export async function getTalentMatchCount(talentId: string) {
  try {
    const supabase = await createClient()

    const { count, error } = await supabase
      .from('matches')
      .select('*', { count: 'exact', head: true })
      .eq('talent_id', talentId)
      .gte('score_total', 40)

    if (error) {
      return { success: false, count: 0 }
    }

    return { success: true, count: count || 0 }
  } catch (error) {
    return { success: false, count: 0 }
  }
}
