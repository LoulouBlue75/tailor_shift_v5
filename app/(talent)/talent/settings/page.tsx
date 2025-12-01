'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import { Container } from '@/components/ui/Layout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { H1, H3, Text } from '@/components/ui/Typography'
import {
  requestPasswordReset,
  updateTalentNotifications,
  updateTalentPrivacy,
  requestAccountDeletion,
  signOut,
} from '@/app/actions/settings'

interface TalentPreferences {
  notifications?: {
    email_notifications?: boolean
    match_alerts?: boolean
    learning_reminders?: boolean
  }
  privacy?: {
    profile_visibility?: string
    show_compensation_alignment?: boolean
  }
}

export default function TalentSettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteReason, setDeleteReason] = useState('')

  const [user, setUser] = useState<{ email: string } | null>(null)
  const [talent, setTalent] = useState<{
    first_name: string
    last_name: string
    career_preferences: TalentPreferences
  } | null>(null)

  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [matchAlerts, setMatchAlerts] = useState(true)
  const [learningReminders, setLearningReminders] = useState(true)

  // Privacy settings
  const [profileVisibility, setProfileVisibility] = useState('visible_to_brands')
  const [showCompensation, setShowCompensation] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      setUser({ email: user.email || '' })

      const { data: talentData } = await supabase
        .from('talents')
        .select('first_name, last_name, career_preferences')
        .eq('profile_id', user.id)
        .single()

      if (talentData) {
        setTalent(talentData)
        const prefs = talentData.career_preferences as TalentPreferences
        if (prefs?.notifications) {
          setEmailNotifications(prefs.notifications.email_notifications ?? true)
          setMatchAlerts(prefs.notifications.match_alerts ?? true)
          setLearningReminders(prefs.notifications.learning_reminders ?? true)
        }
        if (prefs?.privacy) {
          setProfileVisibility(prefs.privacy.profile_visibility ?? 'visible_to_brands')
          setShowCompensation(prefs.privacy.show_compensation_alignment ?? true)
        }
      }

      setLoading(false)
    }

    fetchData()
  }, [router])

  const handlePasswordReset = async () => {
    setSaving(true)
    setMessage(null)
    const result = await requestPasswordReset()
    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'Password reset email sent! Check your inbox.' })
    }
    setSaving(false)
  }

  const handleSaveNotifications = async () => {
    setSaving(true)
    setMessage(null)
    const formData = new FormData()
    formData.append('email_notifications', String(emailNotifications))
    formData.append('match_alerts', String(matchAlerts))
    formData.append('learning_reminders', String(learningReminders))

    const result = await updateTalentNotifications(formData)
    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'Notification preferences saved!' })
    }
    setSaving(false)
  }

  const handleSavePrivacy = async () => {
    setSaving(true)
    setMessage(null)
    const formData = new FormData()
    formData.append('profile_visibility', profileVisibility)
    formData.append('show_compensation', String(showCompensation))

    const result = await updateTalentPrivacy(formData)
    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'Privacy settings saved!' })
    }
    setSaving(false)
  }

  const handleDeleteAccount = async () => {
    setSaving(true)
    setMessage(null)
    const result = await requestAccountDeletion(deleteReason)
    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: result.message || 'Account deletion requested.' })
      setShowDeleteConfirm(false)
    }
    setSaving(false)
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <Container size="lg">
        <div className="py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-concrete rounded w-1/4 mb-8" />
            <div className="space-y-6">
              <div className="h-48 bg-concrete rounded" />
              <div className="h-48 bg-concrete rounded" />
            </div>
          </div>
        </div>
      </Container>
    )
  }

  return (
    <Container size="lg">
      <div className="py-8">
        <H1 className="mb-2">Settings</H1>
        <Text variant="body" className="text-soft-grey mb-8">
          Manage your account, notifications, and privacy preferences
        </Text>

        {message && (
          <div
            className={`p-4 rounded-lg mb-6 ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="space-y-6">
          {/* Account Information */}
          <Card variant="default" className="p-6">
            <H3 className="mb-4">Account Information</H3>
            <div className="space-y-4">
              <div>
                <Text variant="label" className="text-soft-grey mb-1">
                  Name
                </Text>
                <Text variant="body">
                  {talent?.first_name} {talent?.last_name}
                </Text>
              </div>
              <div>
                <Text variant="label" className="text-soft-grey mb-1">
                  Email
                </Text>
                <Text variant="body">{user?.email}</Text>
              </div>
              <div className="pt-4 border-t border-concrete">
                <Button variant="secondary" onClick={handlePasswordReset} disabled={saving}>
                  Change Password
                </Button>
                <Text variant="caption" className="text-soft-grey mt-2 block">
                  We&apos;ll send you an email with a link to reset your password.
                </Text>
              </div>
            </div>
          </Card>

          {/* Notification Preferences */}
          <Card variant="default" className="p-6">
            <H3 className="mb-4">Notification Preferences</H3>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <Text variant="body">Email Notifications</Text>
                  <Text variant="caption" className="text-soft-grey">
                    Receive important updates via email
                  </Text>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="w-5 h-5 rounded border-concrete text-matte-gold focus:ring-matte-gold"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <Text variant="body">Match Alerts</Text>
                  <Text variant="caption" className="text-soft-grey">
                    Get notified when new opportunities match your profile
                  </Text>
                </div>
                <input
                  type="checkbox"
                  checked={matchAlerts}
                  onChange={(e) => setMatchAlerts(e.target.checked)}
                  className="w-5 h-5 rounded border-concrete text-matte-gold focus:ring-matte-gold"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <Text variant="body">Learning Reminders</Text>
                  <Text variant="caption" className="text-soft-grey">
                    Receive reminders about recommended learning modules
                  </Text>
                </div>
                <input
                  type="checkbox"
                  checked={learningReminders}
                  onChange={(e) => setLearningReminders(e.target.checked)}
                  className="w-5 h-5 rounded border-concrete text-matte-gold focus:ring-matte-gold"
                />
              </label>

              <div className="pt-4">
                <Button variant="primary" onClick={handleSaveNotifications} disabled={saving}>
                  Save Notification Preferences
                </Button>
              </div>
            </div>
          </Card>

          {/* Privacy Settings */}
          <Card variant="default" className="p-6">
            <H3 className="mb-4">Privacy Settings</H3>
            <div className="space-y-4">
              <div>
                <Text variant="label" className="text-soft-grey mb-2">
                  Profile Visibility
                </Text>
                <select
                  value={profileVisibility}
                  onChange={(e) => setProfileVisibility(e.target.value)}
                  className="w-full px-4 py-2 border border-concrete rounded-lg focus:outline-none focus:border-matte-gold"
                >
                  <option value="visible_to_brands">Visible to Brands</option>
                  <option value="hidden">Hidden (Only you can see)</option>
                  <option value="visible_to_matches">Visible to Matched Brands Only</option>
                </select>
                <Text variant="caption" className="text-soft-grey mt-1">
                  Control who can see your profile information
                </Text>
              </div>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <Text variant="body">Show Compensation Alignment</Text>
                  <Text variant="caption" className="text-soft-grey">
                    Allow brands to see if your expectations align with their range
                  </Text>
                </div>
                <input
                  type="checkbox"
                  checked={showCompensation}
                  onChange={(e) => setShowCompensation(e.target.checked)}
                  className="w-5 h-5 rounded border-concrete text-matte-gold focus:ring-matte-gold"
                />
              </label>

              <div className="pt-4">
                <Button variant="primary" onClick={handleSavePrivacy} disabled={saving}>
                  Save Privacy Settings
                </Button>
              </div>
            </div>
          </Card>

          {/* Legal Links */}
          <Card variant="default" className="p-6">
            <H3 className="mb-4">Legal</H3>
            <div className="flex gap-4">
              <Link href="/privacy" className="text-matte-gold hover:underline">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-matte-gold hover:underline">
                Terms of Service
              </Link>
            </div>
          </Card>

          {/* Sign Out */}
          <Card variant="default" className="p-6">
            <H3 className="mb-4">Session</H3>
            <Button variant="secondary" onClick={handleSignOut}>
              Sign Out
            </Button>
          </Card>

          {/* Danger Zone */}
          <Card variant="default" className="p-6 border-red-200">
            <H3 className="mb-4 text-red-600">Danger Zone</H3>
            {!showDeleteConfirm ? (
              <div>
                <Text variant="body" className="text-soft-grey mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </Text>
                <Button
                  variant="secondary"
                  className="border-red-500 text-red-600 hover:bg-red-50"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Request Account Deletion
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Text variant="body" className="text-soft-grey">
                  Are you sure you want to delete your account? This action cannot be undone.
                </Text>
                <div>
                  <Text variant="label" className="text-soft-grey mb-2">
                    Reason (optional)
                  </Text>
                  <textarea
                    value={deleteReason}
                    onChange={(e) => setDeleteReason(e.target.value)}
                    className="w-full px-4 py-2 border border-concrete rounded-lg focus:outline-none focus:border-red-500"
                    rows={3}
                    placeholder="Please let us know why you're leaving..."
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    className="border-red-500 text-red-600 hover:bg-red-50"
                    onClick={handleDeleteAccount}
                    disabled={saving}
                  >
                    Yes, Delete My Account
                  </Button>
                  <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </Container>
  )
}
