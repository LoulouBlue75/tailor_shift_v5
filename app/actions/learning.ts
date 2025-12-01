'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Start a learning module
 */
export async function startModule(moduleId: string) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    const { data: talent, error: talentError } = await supabase
      .from('talents')
      .select('id')
      .eq('profile_id', user.id)
      .single()

    if (talentError || !talent) {
      return { success: false, error: 'Talent profile not found' }
    }

    // Upsert progress record
    const { error: progressError } = await supabase
      .from('talent_learning_progress')
      .upsert(
        {
          talent_id: talent.id,
          module_id: moduleId,
          status: 'in_progress',
          progress_pct: 0,
          started_at: new Date().toISOString(),
        },
        { onConflict: 'talent_id,module_id' }
      )

    if (progressError) {
      console.error('Error starting module:', progressError)
      return { success: false, error: 'Failed to start module' }
    }

    revalidatePath('/talent/learning')
    revalidatePath('/talent/dashboard')

    return { success: true }
  } catch (error) {
    console.error('Error in startModule:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Mark a learning module as completed
 */
export async function completeModule(moduleId: string) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    const { data: talent, error: talentError } = await supabase
      .from('talents')
      .select('id')
      .eq('profile_id', user.id)
      .single()

    if (talentError || !talent) {
      return { success: false, error: 'Talent profile not found' }
    }

    // Update progress to completed
    const { error: updateError } = await supabase
      .from('talent_learning_progress')
      .update({
        status: 'completed',
        progress_pct: 100,
        completed_at: new Date().toISOString(),
      })
      .eq('talent_id', talent.id)
      .eq('module_id', moduleId)

    if (updateError) {
      console.error('Error completing module:', updateError)
      return { success: false, error: 'Failed to complete module' }
    }

    revalidatePath('/talent/learning')
    revalidatePath('/talent/dashboard')

    return { success: true }
  } catch (error) {
    console.error('Error in completeModule:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Update module progress percentage
 */
export async function updateModuleProgress(moduleId: string, progressPct: number) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    const { data: talent, error: talentError } = await supabase
      .from('talents')
      .select('id')
      .eq('profile_id', user.id)
      .single()

    if (talentError || !talent) {
      return { success: false, error: 'Talent profile not found' }
    }

    // Update progress
    const { error: updateError } = await supabase
      .from('talent_learning_progress')
      .update({
        progress_pct: Math.min(100, Math.max(0, progressPct)),
        status: progressPct >= 100 ? 'completed' : 'in_progress',
        completed_at: progressPct >= 100 ? new Date().toISOString() : null,
      })
      .eq('talent_id', talent.id)
      .eq('module_id', moduleId)

    if (updateError) {
      console.error('Error updating progress:', updateError)
      return { success: false, error: 'Failed to update progress' }
    }

    revalidatePath('/talent/learning')

    return { success: true }
  } catch (error) {
    console.error('Error in updateModuleProgress:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
