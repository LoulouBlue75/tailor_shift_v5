'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { updateOpportunityStatus, deleteOpportunity } from '@/app/actions/opportunities'

interface OpportunityActionsProps {
  opportunityId: string
  status: string
}

export function OpportunityActions({ opportunityId, status }: OpportunityActionsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showFilledConfirm, setShowFilledConfirm] = useState(false)

  const handleStatusChange = async (newStatus: 'active' | 'paused' | 'filled' | 'cancelled') => {
    setIsLoading(true)
    try {
      const result = await updateOpportunityStatus(opportunityId, newStatus)
      if (result.success) {
        router.refresh()
      } else {
        alert(result.error || 'Failed to update status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert('An error occurred')
    } finally {
      setIsLoading(false)
      setShowFilledConfirm(false)
    }
  }

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      const result = await deleteOpportunity(opportunityId)
      if (result.success) {
        router.push('/brand/opportunities')
      } else {
        alert(result.error || 'Failed to delete opportunity')
      }
    } catch (error) {
      console.error('Error deleting opportunity:', error)
      alert('An error occurred')
    } finally {
      setIsLoading(false)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <div className="flex gap-2">
      {/* Pause/Unpause */}
      {status === 'active' && (
        <Button
          variant="secondary"
          onClick={() => handleStatusChange('paused')}
          disabled={isLoading}
        >
          Pause
        </Button>
      )}
      {status === 'paused' && (
        <Button
          variant="primary"
          onClick={() => handleStatusChange('active')}
          disabled={isLoading}
        >
          Unpause
        </Button>
      )}

      {/* Mark as Filled */}
      {(status === 'active' || status === 'paused') && !showFilledConfirm && (
        <Button
          variant="secondary"
          onClick={() => setShowFilledConfirm(true)}
          disabled={isLoading}
        >
          Mark as Filled
        </Button>
      )}
      {showFilledConfirm && (
        <div className="flex gap-2">
          <Button
            variant="primary"
            onClick={() => handleStatusChange('filled')}
            disabled={isLoading}
          >
            Confirm
          </Button>
          <Button
            variant="secondary"
            onClick={() => setShowFilledConfirm(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      )}

      {/* Delete */}
      {(status === 'draft' || status === 'filled') && !showDeleteConfirm && (
        <Button
          variant="secondary"
          onClick={() => setShowDeleteConfirm(true)}
          disabled={isLoading}
          className="text-red-600 hover:bg-red-50"
        >
          Delete
        </Button>
      )}
      {showDeleteConfirm && (
        <div className="flex gap-2">
          <Button
            variant="primary"
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            Confirm Delete
          </Button>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteConfirm(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  )
}
