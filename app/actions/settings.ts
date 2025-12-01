'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Update password (sends reset email)
 */
export async function requestPasswordReset() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) {
    return { error: 'User not authenticated' }
  }

  const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true, message: 'Password reset email sent' }
}

/**
 * Update talent notification preferences
 */
export async function updateTalentNotifications(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { data: talent } = await supabase
    .from('talents')
    .select('id, career_preferences')
    .eq('profile_id', user.id)
    .single()

  if (!talent) {
    return { error: 'Talent profile not found' }
  }

  const emailNotifications = formData.get('email_notifications') === 'true'
  const matchAlerts = formData.get('match_alerts') === 'true'
  const learningReminders = formData.get('learning_reminders') === 'true'

  const currentPrefs = (talent.career_preferences as Record<string, unknown>) || {}
  const updatedPrefs = {
    ...currentPrefs,
    notifications: {
      email_notifications: emailNotifications,
      match_alerts: matchAlerts,
      learning_reminders: learningReminders,
    },
  }

  const { error } = await supabase
    .from('talents')
    .update({ career_preferences: updatedPrefs })
    .eq('id', talent.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/talent/settings')
  return { success: true }
}

/**
 * Update talent privacy settings
 */
export async function updateTalentPrivacy(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { data: talent } = await supabase
    .from('talents')
    .select('id, career_preferences')
    .eq('profile_id', user.id)
    .single()

  if (!talent) {
    return { error: 'Talent profile not found' }
  }

  const profileVisibility = formData.get('profile_visibility') as string
  const showCompensation = formData.get('show_compensation') === 'true'

  const currentPrefs = (talent.career_preferences as Record<string, unknown>) || {}
  const updatedPrefs = {
    ...currentPrefs,
    privacy: {
      profile_visibility: profileVisibility || 'visible_to_brands',
      show_compensation_alignment: showCompensation,
    },
  }

  const { error } = await supabase
    .from('talents')
    .update({ career_preferences: updatedPrefs })
    .eq('id', talent.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/talent/settings')
  return { success: true }
}

/**
 * Request account deletion
 */
export async function requestAccountDeletion(reason?: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('user_type')
    .eq('id', user.id)
    .single()

  if (!profile) {
    return { error: 'Profile not found' }
  }

  // In V1, we just mark the request in the profile metadata
  // A full deletion flow would be implemented in V2
  const { error } = await supabase.auth.updateUser({
    data: {
      deletion_requested: true,
      deletion_requested_at: new Date().toISOString(),
      deletion_reason: reason || 'No reason provided',
    },
  })

  if (error) {
    return { error: error.message }
  }

  return {
    success: true,
    message: 'Account deletion request submitted. Our team will process this within 30 days.',
  }
}

/**
 * Update brand profile
 */
export async function updateBrandProfile(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { data: brand } = await supabase
    .from('brands')
    .select('id')
    .eq('profile_id', user.id)
    .single()

  if (!brand) {
    return { error: 'Brand profile not found' }
  }

  const name = formData.get('name') as string
  const website = formData.get('website') as string
  const segment = formData.get('segment') as string
  const contactName = formData.get('contact_name') as string
  const contactRole = formData.get('contact_role') as string
  const contactEmail = formData.get('contact_email') as string
  const contactPhone = formData.get('contact_phone') as string

  const { error } = await supabase
    .from('brands')
    .update({
      name,
      website,
      segment,
      contact_name: contactName,
      contact_role: contactRole,
      contact_email: contactEmail,
      contact_phone: contactPhone,
      updated_at: new Date().toISOString(),
    })
    .eq('id', brand.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/brand/profile')
  revalidatePath('/brand/settings')
  return { success: true }
}

/**
 * Update brand notification preferences
 */
export async function updateBrandNotifications(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Store in user metadata since brands table doesn't have a preferences column
  const emailNotifications = formData.get('email_notifications') === 'true'
  const newMatchAlerts = formData.get('new_match_alerts') === 'true'
  const weeklyDigest = formData.get('weekly_digest') === 'true'

  const { error } = await supabase.auth.updateUser({
    data: {
      notification_preferences: {
        email_notifications: emailNotifications,
        new_match_alerts: newMatchAlerts,
        weekly_digest: weeklyDigest,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/brand/settings')
  return { success: true }
}

/**
 * Sign out user
 */
export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  return { success: true }
}
