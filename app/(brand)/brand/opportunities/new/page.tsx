'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Container } from '@/components/ui/Layout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { H1, H3, Text } from '@/components/ui/Typography'
import { Badge } from '@/components/ui/Badge'
import { OpportunityForm } from '@/components/brand/OpportunityForm'
import { OPPORTUNITY_TEMPLATES, OpportunityTemplate } from '@/data/templates/opportunities'
import { getStores } from '@/app/actions/stores'

export default function NewOpportunityPage() {
  const router = useRouter()
  const [selectedTemplate, setSelectedTemplate] = useState<OpportunityTemplate | null>(null)
  const [stores, setStores] = useState<Array<{ id: string; name: string; city: string }>>([])

  useEffect(() => {
    async function loadStores() {
      const result = await getStores()
      if (Array.isArray(result)) {
        setStores(result.map((s: { id: string; name: string; city: string }) => ({ id: s.id, name: s.name, city: s.city })))
      }
    }
    loadStores()
  }, [])

  if (selectedTemplate !== null) {
    return (
      <Container size="xl">
        <div className="py-8">
          <div className="mb-6">
            <Button variant="secondary" onClick={() => setSelectedTemplate(null)}>
              ← Back to Templates
            </Button>
          </div>
          <H1 className="mb-2">Create Opportunity</H1>
          <Text variant="body" className="text-soft-grey mb-8">
            {selectedTemplate.title ? `Using template: ${selectedTemplate.title}` : 'Create from scratch'}
          </Text>
          <OpportunityForm
            mode="create"
            initialData={selectedTemplate}
            stores={stores}
          />
        </div>
      </Container>
    )
  }

  return (
    <Container size="xl">
      <div className="py-8">
        <div className="mb-8">
          <H1 className="mb-2">Create New Opportunity</H1>
          <Text variant="body" className="text-soft-grey">
            Choose a template to get started, or create a custom opportunity from scratch
          </Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Start from Scratch Card */}
          <Card
            variant="interactive"
            className="p-6 hover:border-charcoal transition-colors cursor-pointer"
            onClick={() => setSelectedTemplate({} as OpportunityTemplate)}
          >
            <div className="flex flex-col h-full">
              <div className="mb-4">
                <div className="w-12 h-12 bg-matte-gold rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">+</span>
                </div>
                <H3 className="mb-2">Start from Scratch</H3>
                <Text variant="body" className="text-soft-grey">
                  Create a custom opportunity with your own requirements
                </Text>
              </div>
              <div className="mt-auto">
                <Button variant="secondary" className="w-full">
                  Create Custom
                </Button>
              </div>
            </div>
          </Card>

          {/* Template Cards */}
          {OPPORTUNITY_TEMPLATES.map((template) => (
            <Card
              key={template.id}
              variant="interactive"
              className="p-6 hover:border-charcoal transition-colors cursor-pointer"
              onClick={() => setSelectedTemplate(template)}
            >
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <div className="flex gap-2 mb-3">
                    <Badge>{template.roleLevel}</Badge>
                    {template.division && (
                      <Badge>
                        {template.division.replace(/_/g, ' ')}
                      </Badge>
                    )}
                  </div>
                  <H3 className="mb-2">{template.title}</H3>
                  <Text variant="body" className="text-soft-grey text-sm line-clamp-3 mb-3">
                    {template.description}
                  </Text>
                  <div className="space-y-1">
                    <Text variant="caption" className="text-soft-grey">
                      <strong>Experience:</strong> {template.requiredExperienceYears}+ years
                    </Text>
                    <Text variant="caption" className="text-soft-grey">
                      <strong>Responsibilities:</strong> {template.responsibilities.length} key areas
                    </Text>
                  </div>
                </div>
                <div className="mt-auto">
                  <Button variant="secondary" className="w-full">
                    Use Template
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Container>
  )
}
