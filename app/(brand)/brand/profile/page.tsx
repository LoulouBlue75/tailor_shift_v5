'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import { Container } from '@/components/ui/Layout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { H1, H3, Text } from '@/components/ui/Typography'
import { Badge } from '@/components/ui/Badge'
import { updateBrandProfile } from '@/app/actions/settings'

const SEGMENT_OPTIONS = [
  { value: 'ultra_luxury', label: 'Ultra Luxury' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'premium', label: 'Premium' },
  { value: 'accessible_luxury', label: 'Accessible Luxury' },
]

interface Brand {
  id: string
  name: string
  logo_url: string | null
  website: string | null
  segment: string | null
  divisions: string[]
  headquarters_location: string | null
  contact_name: string | null
  contact_role: string | null
  contact_email: string | null
  contact_phone: string | null
  verified: boolean
  created_at: string
}

export default function BrandProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [brand, setBrand] = useState<Brand | null>(null)

  // Form state
  const [name, setName] = useState('')
  const [website, setWebsite] = useState('')
  const [segment, setSegment] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactRole, setContactRole] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')

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

      const { data: brandData } = await supabase
        .from('brands')
        .select('*')
        .eq('profile_id', user.id)
        .single()

      if (brandData) {
        setBrand(brandData)
        setName(brandData.name || '')
        setWebsite(brandData.website || '')
        setSegment(brandData.segment || '')
        setContactName(brandData.contact_name || '')
        setContactRole(brandData.contact_role || '')
        setContactEmail(brandData.contact_email || '')
        setContactPhone(brandData.contact_phone || '')
      }

      setLoading(false)
    }

    fetchData()
  }, [router])

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    const formData = new FormData()
    formData.append('name', name)
    formData.append('website', website)
    formData.append('segment', segment)
    formData.append('contact_name', contactName)
    formData.append('contact_role', contactRole)
    formData.append('contact_email', contactEmail)
    formData.append('contact_phone', contactPhone)

    const result = await updateBrandProfile(formData)
    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'Brand profile updated successfully!' })
      setIsEditing(false)
      // Update local state
      setBrand((prev) =>
        prev
          ? {
              ...prev,
              name,
              website,
              segment,
              contact_name: contactName,
              contact_role: contactRole,
              contact_email: contactEmail,
              contact_phone: contactPhone,
            }
          : null
      )
    }
    setSaving(false)
  }

  const handleCancel = () => {
    // Reset form to original values
    if (brand) {
      setName(brand.name || '')
      setWebsite(brand.website || '')
      setSegment(brand.segment || '')
      setContactName(brand.contact_name || '')
      setContactRole(brand.contact_role || '')
      setContactEmail(brand.contact_email || '')
      setContactPhone(brand.contact_phone || '')
    }
    setIsEditing(false)
    setMessage(null)
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <H1 className="mb-2">Brand Profile</H1>
            <Text variant="body" className="text-soft-grey">
              Manage your brand information and contact details
            </Text>
          </div>
          {!isEditing && (
            <Button variant="primary" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </div>

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
          {/* Brand Identity */}
          <Card variant="default" className="p-6">
            <div className="flex justify-between items-start mb-4">
              <H3>Brand Identity</H3>
              {brand?.verified && <Badge variant="success">Verified</Badge>}
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <Input
                  label="Brand Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter brand name"
                  required
                />

                <Input
                  label="Website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://www.example.com"
                  type="url"
                />

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Segment</label>
                  <select
                    value={segment}
                    onChange={(e) => setSegment(e.target.value)}
                    className="w-full px-4 py-2 border border-concrete rounded-lg focus:outline-none focus:border-matte-gold"
                  >
                    <option value="">Select segment</option>
                    {SEGMENT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  {brand?.logo_url ? (
                    <img
                      src={brand.logo_url}
                      alt={brand.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-off-white flex items-center justify-center">
                      <span className="text-2xl font-bold text-soft-grey">
                        {brand?.name?.charAt(0) || 'B'}
                      </span>
                    </div>
                  )}
                  <div>
                    <Text variant="body" className="font-semibold">
                      {brand?.name}
                    </Text>
                    {brand?.segment && (
                      <Badge className="mt-1">
                        {SEGMENT_OPTIONS.find((s) => s.value === brand.segment)?.label ||
                          brand.segment}
                      </Badge>
                    )}
                  </div>
                </div>

                {brand?.website && (
                  <div>
                    <Text variant="label" className="text-soft-grey mb-1">
                      Website
                    </Text>
                    <a
                      href={brand.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-matte-gold hover:underline"
                    >
                      {brand.website}
                    </a>
                  </div>
                )}

                {brand?.divisions && brand.divisions.length > 0 && (
                  <div>
                    <Text variant="label" className="text-soft-grey mb-2">
                      Divisions
                    </Text>
                    <div className="flex flex-wrap gap-2">
                      {brand.divisions.map((div) => (
                        <Badge key={div}>{div.replace(/_/g, ' ')}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {brand?.headquarters_location && (
                  <div>
                    <Text variant="label" className="text-soft-grey mb-1">
                      Headquarters
                    </Text>
                    <Text variant="body">{brand.headquarters_location}</Text>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Contact Information */}
          <Card variant="default" className="p-6">
            <H3 className="mb-4">Contact Information</H3>

            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Contact Name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Full name"
                />

                <Input
                  label="Role"
                  value={contactRole}
                  onChange={(e) => setContactRole(e.target.value)}
                  placeholder="e.g., HR Director"
                />

                <Input
                  label="Email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="contact@example.com"
                  type="email"
                  required
                />

                <Input
                  label="Phone"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+1 234 567 890"
                  type="tel"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Text variant="label" className="text-soft-grey mb-1">
                    Contact Name
                  </Text>
                  <Text variant="body">{brand?.contact_name || '—'}</Text>
                </div>

                <div>
                  <Text variant="label" className="text-soft-grey mb-1">
                    Role
                  </Text>
                  <Text variant="body">{brand?.contact_role || '—'}</Text>
                </div>

                <div>
                  <Text variant="label" className="text-soft-grey mb-1">
                    Email
                  </Text>
                  <Text variant="body">{brand?.contact_email || '—'}</Text>
                </div>

                <div>
                  <Text variant="label" className="text-soft-grey mb-1">
                    Phone
                  </Text>
                  <Text variant="body">{brand?.contact_phone || '—'}</Text>
                </div>
              </div>
            )}
          </Card>

          {/* Quick Links */}
          {!isEditing && (
            <Card variant="default" className="p-6">
              <H3 className="mb-4">Quick Links</H3>
              <div className="flex flex-wrap gap-3">
                <Link href="/brand/stores">
                  <Button variant="secondary">Manage Stores</Button>
                </Link>
                <Link href="/brand/opportunities">
                  <Button variant="secondary">View Opportunities</Button>
                </Link>
                <Link href="/brand/settings">
                  <Button variant="secondary">Account Settings</Button>
                </Link>
              </div>
            </Card>
          )}

          {/* Edit Actions */}
          {isEditing && (
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={handleCancel} disabled={saving}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}

          {/* Account Info */}
          {!isEditing && (
            <Card variant="default" className="p-6 bg-off-white">
              <Text variant="caption" className="text-soft-grey">
                Member since {brand?.created_at ? new Date(brand.created_at).toLocaleDateString() : '—'}
              </Text>
            </Card>
          )}
        </div>
      </div>
    </Container>
  )
}
