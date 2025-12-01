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
  updateBrandNotifications,
  requestAccountDeletion,
  signOut,
} from '@/app/actions/settings'

interface NotificationPreferences {
  email_notifications?: boolean
  new_match_alerts?: boolean
  weekly_digest?: boolean
}

export default function BrandSettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteReason, setDeleteReason] = useState('')

  const [user, setUser] = useState<{
    email: string
    notification_preferences?: NotificationPreferences
  } | null>(null)
  const [brand, setBrand] = useState<{ name: string } | null>(null)

  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [newMatchAlerts, setNewMatchAlerts] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(true)

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

      const prefs = user.user_metadata?.notification_preferences as NotificationPreferences | undefined
      setUser({
        email: user.email || '',
        notification_preferences: prefs,
      })

      if (prefs) {
        setEmailNotifications(prefs.email_notifications ?? true)
        setNewMatchAlerts(prefs.new_match_alerts ?? true)
        setWeeklyDigest(prefs.weekly_digest ?? true)
      }

      const { data: brandData } = await supabase
        .from('brands')
        .select('name')
        .eq('profile_id', user.id)
        .single()

      if (brandData) {
        setBrand(brandData)
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
    formData.append('new_match_alerts', String(newMatchAlerts))
    formData.append('weekly_digest', String(weeklyDigest))

    const result = await updateBrandNotifications(formData)
    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'Notification preferences saved!' })
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
          Manage your account and notification preferences
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
                  Brand
                </Text>
                <Text variant="body">{brand?.name}</Text>
              </div>
              <div>
                <Text variant="label" className="text-soft-grey mb-1">
                  Email
                </Text>
                <Text variant="body">{user?.email}</Text>
              </div>
              <div className="pt-4 border-t border-concrete flex gap-4">
                <Link href="/brand/profile">
                  <Button variant="primary">Edit Brand Profile</Button>
                </Link>
                <Button variant="secondary" onClick={handlePasswordReset} disabled={saving}>
                  Change Password
                </Button>
              </div>
              <Text variant="caption" className="text-soft-grey">
                Change password will send you an email with a link to reset.
              </Text>
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
                  <Text variant="body">New Match Alerts</Text>
                  <Text variant="caption" className="text-soft-grey">
                    Get notified when new talents match your opportunities
                  </Text>
                </div>
                <input
                  type="checkbox"
                  checked={newMatchAlerts}
                  onChange={(e) => setNewMatchAlerts(e.target.checked)}
                  className="w-5 h-5 rounded border-concrete text-matte-gold focus:ring-matte-gold"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <Text variant="body">Weekly Digest</Text>
                  <Text variant="caption" className="text-soft-grey">
                    Receive a weekly summary of activity and top matches
                  </Text>
                </div>
                <input
                  type="checkbox"
                  checked={weeklyDigest}
                  onChange={(e) => setWeeklyDigest(e.target.checked)}
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
                  Once you delete your account, all your brand data, stores, and opportunities will
                  be permanently removed. Please be certain.
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
