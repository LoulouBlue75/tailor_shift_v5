'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { processAssessment, AssessmentAnswers } from '@/lib/engines/assessment'
import { rematchTalent } from './matching'

/**
 * Submit assessment and save results
 */
export async function submitAssessment(answers: AssessmentAnswers) {
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

    // Get talent
    const { data: talent, error: talentError } = await supabase
      .from('talents')
      .select('id')
      .eq('profile_id', user.id)
      .single()

    if (talentError || !talent) {
      return { success: false, error: 'Talent profile not found' }
    }

    // Process assessment (score and generate insights)
    const result = processAssessment(answers)

    // Save to assessments table
    const { data: assessment, error: assessmentError } = await supabase
      .from('assessments')
      .insert({
        talent_id: talent.id,
        version: result.version,
        service_excellence_score: result.scores.service_excellence,
        clienteling_score: result.scores.clienteling,
        operations_score: result.scores.operations,
        leadership_score: result.scores.leadership_signals,
        responses: null, // Privacy: do not save answers
        status: 'completed',
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (assessmentError) {
      console.error('Error saving assessment:', assessmentError)
      return { success: false, error: 'Failed to save assessment' }
    }

    // Update talent assessment_summary
    const { error: updateError } = await supabase
      .from('talents')
      .update({
        assessment_summary: {
          service_excellence: result.scores.service_excellence,
          clienteling: result.scores.clienteling,
          operations: result.scores.operations,
          leadership_signals: result.scores.leadership_signals,
          version: result.version,
          completed_at: new Date().toISOString(),
        },
      })
      .eq('id', talent.id)

    if (updateError) {
      console.error('Error updating talent summary:', updateError)
      return { success: false, error: 'Failed to update profile' }
    }

    revalidatePath('/talent/dashboard')
    revalidatePath('/talent/profile')

    // Trigger re-matching with updated assessment scores
    await rematchTalent(talent.id)

    return { 
      success: true, 
      assessmentId: assessment.id,
      scores: result.scores,
      insights: result.insights,
    }
  } catch (error) {
    console.error('Error in submitAssessment:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Get latest assessment results
 */
export async function getLatestAssessment() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: 'Not authenticated', assessment: null }
    }

    const { data: talent, error: talentError } = await supabase
      .from('talents')
      .select('id')
      .eq('profile_id', user.id)
      .single()

    if (talentError || !talent) {
      return { success: false, error: 'Talent profile not found', assessment: null }
    }

    // Get latest completed assessment
    const { data: assessment, error: assessmentError } = await supabase
      .from('assessments')
      .select('*')
      .eq('talent_id', talent.id)
      .eq('status', 'completed')
      .order('completed_at', { ascending: false })
      .limit(1)
      .single()

    if (assessmentError && assessmentError.code !== 'PGRST116') {
      console.error('Error fetching assessment:', assessmentError)
      return { success: false, error: 'Failed to fetch assessment', assessment: null }
    }

    return { success: true, assessment: assessment || null }
  } catch (error) {
    console.error('Error in getLatestAssessment:', error)
    return { success: false, error: 'An unexpected error occurred', assessment: null }
  }
}

/**
 * Check if talent can retake assessment (simplified V1 - always allow)
 */
export async function canRetakeAssessment() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, canRetake: false, error: 'Not authenticated' }
    }

    const { data: talent, error: talentError } = await supabase
      .from('talents')
      .select('id')
      .eq('profile_id', user.id)
      .single()

    if (talentError || !talent) {
      return { success: false, canRetake: false, error: 'Talent profile not found' }
    }

    // Get latest assessment
    const { data: assessment } = await supabase
      .from('assessments')
      .select('completed_at')
      .eq('talent_id', talent.id)
      .eq('status', 'completed')
      .order('completed_at', { ascending: false })
      .limit(1)
      .single()

    // V1: Allow retake after 6 months (or always for testing)
    if (!assessment) {
      return { success: true, canRetake: true }
    }

    const completedAt = new Date(assessment.completed_at)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const canRetake = completedAt < sixMonthsAgo

    return { 
      success: true, 
      canRetake, 
      nextAvailableDate: canRetake ? null : new Date(completedAt.getTime() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString(),
    }
  } catch (error) {
    console.error('Error in canRetakeAssessment:', error)
    return { success: false, canRetake: false, error: 'An unexpected error occurred' }
  }
}
