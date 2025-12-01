'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { H1, H3, Text } from '@/components/ui/Typography'
import { createOpportunity, updateOpportunity } from '@/app/actions/opportunities'
import { RoleLevel, Division } from '@/lib/supabase/database.types'
import { OpportunityTemplate } from '@/data/templates/opportunities'

interface OpportunityFormProps {
  mode: 'create' | 'edit'
  initialData?: Partial<OpportunityTemplate> | any
  opportunityId?: string
  stores?: Array<{ id: string; name: string; city: string }>
}

const ROLE_LEVELS: RoleLevel[] = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8']

const DIVISIONS: { value: Division; label: string }[] = [
  { value: 'fashion', label: 'Fashion' },
  { value: 'leather_goods', label: 'Leather Goods' },
  { value: 'shoes', label: 'Shoes' },
  { value: 'beauty', label: 'Beauty' },
  { value: 'fragrance', label: 'Fragrance' },
  { value: 'watches', label: 'Watches' },
  { value: 'high_jewelry', label: 'High Jewelry' },
  { value: 'eyewear', label: 'Eyewear' },
  { value: 'accessories', label: 'Accessories' },
]

const CURRENCIES = ['EUR', 'USD', 'GBP', 'CHF', 'JPY', 'CNY', 'AED']

export function OpportunityForm({ mode, initialData, opportunityId, stores = [] }: OpportunityFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [title, setTitle] = useState(initialData?.title || '')
  const [storeId, setStoreId] = useState<string>(initialData?.store_id || initialData?.storeId || '')
  const [roleLevel, setRoleLevel] = useState<RoleLevel>(initialData?.role_level || initialData?.roleLevel || 'L1')
  const [division, setDivision] = useState<Division | ''>(initialData?.division || '')
  const [requiredExperienceYears, setRequiredExperienceYears] = useState<number>(
    initialData?.required_experience_years ?? initialData?.requiredExperienceYears ?? 0
  )
  const [requiredLanguages, setRequiredLanguages] = useState<string[]>(
    initialData?.required_languages || initialData?.requiredLanguages || []
  )
  const [languageInput, setLanguageInput] = useState('')
  const [requiredSkills, setRequiredSkills] = useState<string[]>(
    initialData?.required_skills || initialData?.requiredSkills || []
  )
  const [skillInput, setSkillInput] = useState('')
  const [description, setDescription] = useState(initialData?.description || '')
  const [responsibilities, setResponsibilities] = useState<string[]>(
    initialData?.responsibilities || ['', '', '']
  )
  const [benefits, setBenefits] = useState<string[]>(initialData?.benefits || [])
  const [benefitInput, setBenefitInput] = useState('')

  // Compensation range state
  const [minBase, setMinBase] = useState<number | ''>(
    initialData?.compensation_range?.min_base ?? ''
  )
  const [maxBase, setMaxBase] = useState<number | ''>(
    initialData?.compensation_range?.max_base ?? ''
  )
  const [variablePct, setVariablePct] = useState<number | ''>(
    initialData?.compensation_range?.variable_pct ?? ''
  )
  const [currency, setCurrency] = useState(
    initialData?.compensation_range?.currency || 'EUR'
  )

  const handleAddLanguage = () => {
    if (languageInput.trim() && !requiredLanguages.includes(languageInput.trim())) {
      setRequiredLanguages([...requiredLanguages, languageInput.trim()])
      setLanguageInput('')
    }
  }

  const handleRemoveLanguage = (lang: string) => {
    setRequiredLanguages(requiredLanguages.filter((l) => l !== lang))
  }

  const handleAddSkill = () => {
    if (skillInput.trim() && !requiredSkills.includes(skillInput.trim())) {
      setRequiredSkills([...requiredSkills, skillInput.trim()])
      setSkillInput('')
    }
  }

  const handleRemoveSkill = (skill: string) => {
    setRequiredSkills(requiredSkills.filter((s) => s !== skill))
  }

  const handleAddBenefit = () => {
    if (benefitInput.trim()) {
      setBenefits([...benefits, benefitInput.trim()])
      setBenefitInput('')
    }
  }

  const handleRemoveBenefit = (index: number) => {
    setBenefits(benefits.filter((_, i) => i !== index))
  }

  const handleAddResponsibility = () => {
    if (responsibilities.length < 10) {
      setResponsibilities([...responsibilities, ''])
    }
  }

  const handleRemoveResponsibility = (index: number) => {
    if (responsibilities.length > 3) {
      setResponsibilities(responsibilities.filter((_, i) => i !== index))
    }
  }

  const handleResponsibilityChange = (index: number, value: string) => {
    const updated = [...responsibilities]
    updated[index] = value
    setResponsibilities(updated)
  }

  const validateForm = () => {
    if (!title || title.length < 5) {
      setError('Title must be at least 5 characters')
      return false
    }
    if (!description || description.length < 100) {
      setError('Description must be at least 100 characters')
      return false
    }
    if (description.length > 2000) {
      setError('Description must not exceed 2000 characters')
      return false
    }
    const filledResponsibilities = responsibilities.filter((r) => r.trim() !== '')
    if (filledResponsibilities.length < 3) {
      setError('At least 3 responsibilities are required')
      return false
    }
    if (minBase && maxBase && Number(maxBase) < Number(minBase)) {
      setError('Maximum compensation must be greater than or equal to minimum')
      return false
    }
    return true
  }

  const handleSubmit = async (status: 'draft' | 'active') => {
    setError(null)

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const formData = {
        title,
        storeId: storeId || null,
        roleLevel,
        division: division || null,
        requiredExperienceYears,
        requiredLanguages,
        requiredSkills,
        description,
        responsibilities: responsibilities.filter((r) => r.trim() !== ''),
        benefits,
        compensationRange: {
          min_base: minBase ? Number(minBase) : null,
          max_base: maxBase ? Number(maxBase) : null,
          variable_pct: variablePct ? Number(variablePct) : null,
          currency,
        },
      }

      let result
      if (mode === 'create') {
        result = await createOpportunity(formData, status)
      } else if (opportunityId) {
        result = await updateOpportunity(opportunityId, formData)
      }

      if (result?.success) {
        if (mode === 'create' && 'opportunityId' in result) {
          router.push(`/brand/opportunities/${result.opportunityId}`)
        } else {
          router.push('/brand/opportunities')
        }
      } else {
        setError(result?.error || 'An error occurred')
      }
    } catch (err) {
      console.error('Error submitting form:', err)
      setError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <Card variant="interactive" className="p-4 bg-red-50 border-red-200">
          <Text variant="body" className="text-red-600">
            {error}
          </Text>
        </Card>
      )}

      <Card variant="interactive" className="p-6">
        <H3 className="mb-4">Basic Information</H3>

        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Sales Advisor - Fashion"
              maxLength={200}
              className="w-full px-4 py-2 border border-soft-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Store</label>
            <select
              value={storeId}
              onChange={(e) => setStoreId(e.target.value)}
              className="w-full px-4 py-2 border border-soft-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal"
            >
              <option value="">Brand-level (no specific store)</option>
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name} - {store.city}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Role Level <span className="text-red-500">*</span>
              </label>
              <select
                value={roleLevel}
                onChange={(e) => setRoleLevel(e.target.value as RoleLevel)}
                className="w-full px-4 py-2 border border-soft-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal"
              >
                {ROLE_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Division</label>
              <select
                value={division}
                onChange={(e) => setDivision(e.target.value as Division | '')}
                className="w-full px-4 py-2 border border-soft-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal"
              >
                <option value="">Not specified</option>
                {DIVISIONS.map((div) => (
                  <option key={div.value} value={div.value}>
                    {div.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="experience" className="block text-sm font-medium mb-1">
              Required Experience (years)
            </label>
            <input
              id="experience"
              type="number"
              min="0"
              value={requiredExperienceYears}
              onChange={(e) => setRequiredExperienceYears(Number(e.target.value))}
              className="w-full px-4 py-2 border border-soft-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal"
            />
          </div>
        </div>
      </Card>

      <Card variant="interactive" className="p-6">
        <H3 className="mb-4">Requirements</H3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Required Languages</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={languageInput}
                onChange={(e) => setLanguageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLanguage())}
                placeholder="e.g., English, French"
                className="flex-1 px-4 py-2 border border-soft-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal"
              />
              <Button variant="secondary" onClick={handleAddLanguage}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {requiredLanguages.map((lang) => (
                <span
                  key={lang}
                  className="px-3 py-1 bg-soft-grey rounded-full text-sm flex items-center gap-2"
                >
                  {lang}
                  <button
                    onClick={() => handleRemoveLanguage(lang)}
                    className="text-charcoal hover:text-black"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Required Skills</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                placeholder="e.g., Service Excellence, Clienteling"
                className="flex-1 px-4 py-2 border border-soft-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal"
              />
              <Button variant="secondary" onClick={handleAddSkill}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {requiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-soft-grey rounded-full text-sm flex items-center gap-2"
                >
                  {skill}
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-charcoal hover:text-black"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card variant="interactive" className="p-6">
        <H3 className="mb-4">
          Description <span className="text-red-500">*</span>
        </H3>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the role and what the ideal candidate would bring..."
          rows={6}
          maxLength={2000}
          className="w-full px-4 py-2 border border-soft-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal"
        />
        <p className="text-sm text-soft-grey mt-1">
          {description.length} / 2000 characters (minimum 100)
        </p>
      </Card>

      <Card variant="interactive" className="p-6">
        <H3 className="mb-4">
          Responsibilities <span className="text-red-500">*</span>
        </H3>
        <Text variant="body" className="text-soft-grey mb-4">
          List 3-10 key responsibilities (minimum 3 required)
        </Text>
        <div className="space-y-3">
          {responsibilities.map((resp, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={resp}
                onChange={(e) => handleResponsibilityChange(index, e.target.value)}
                placeholder={`Responsibility ${index + 1}`}
                className="flex-1 px-4 py-2 border border-soft-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal"
              />
              {responsibilities.length > 3 && (
                <Button
                  variant="secondary"
                  onClick={() => handleRemoveResponsibility(index)}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
        </div>
        {responsibilities.length < 10 && (
          <Button variant="secondary" onClick={handleAddResponsibility} className="mt-3">
            Add Responsibility
          </Button>
        )}
      </Card>

      <Card variant="interactive" className="p-6">
        <H3 className="mb-4">Benefits (Optional)</H3>
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={benefitInput}
              onChange={(e) => setBenefitInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddBenefit())}
              placeholder="e.g., Health insurance, Professional development"
              className="flex-1 px-4 py-2 border border-soft-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal"
            />
            <Button variant="secondary" onClick={handleAddBenefit}>
              Add
            </Button>
          </div>
          <div className="space-y-2">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 bg-soft-grey rounded"
              >
                <span>{benefit}</span>
                <button
                  onClick={() => handleRemoveBenefit(index)}
                  className="text-charcoal hover:text-black"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card variant="interactive" className="p-6 bg-blue-50 border-blue-200">
        <H3 className="mb-2">Compensation Range (Internal Only)</H3>
        <Text variant="body" className="text-soft-grey mb-4">
          This information is never shown to candidates. Used only for internal alignment.
        </Text>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="minBase" className="block text-sm font-medium mb-1">Min Base</label>
              <input
                id="minBase"
                type="number"
                min="0"
                value={minBase}
                onChange={(e) => setMinBase(e.target.value ? Number(e.target.value) : '')}
                placeholder="e.g., 40000"
                className="w-full px-4 py-2 border border-soft-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal"
              />
            </div>
            <div>
              <label htmlFor="maxBase" className="block text-sm font-medium mb-1">Max Base</label>
              <input
                id="maxBase"
                type="number"
                min="0"
                value={maxBase}
                onChange={(e) => setMaxBase(e.target.value ? Number(e.target.value) : '')}
                placeholder="e.g., 50000"
                className="w-full px-4 py-2 border border-soft-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-4 py-2 border border-soft-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal"
              >
                {CURRENCIES.map((curr) => (
                  <option key={curr} value={curr}>
                    {curr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="variablePct" className="block text-sm font-medium mb-1">Variable % (optional)</label>
            <input
              id="variablePct"
              type="number"
              min="0"
              max="100"
              value={variablePct}
              onChange={(e) => setVariablePct(e.target.value ? Number(e.target.value) : '')}
              placeholder="e.g., 20"
              className="w-full px-4 py-2 border border-soft-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal"
            />
          </div>
        </div>
      </Card>

      <div className="flex gap-4">
        <Button
          variant="secondary"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          variant="secondary"
          onClick={() => handleSubmit('draft')}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save as Draft'}
        </Button>
        <Button
          variant="primary"
          onClick={() => handleSubmit('active')}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Publishing...' : mode === 'create' ? 'Publish Opportunity' : 'Save & Publish'}
        </Button>
      </div>
    </div>
  )
}
