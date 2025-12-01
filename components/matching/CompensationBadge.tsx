import { Badge } from '@/components/ui/Badge'

interface CompensationBadgeProps {
  alignment: 'within_range' | 'above_range' | 'below_range' | 'unknown'
}

export function CompensationBadge({ alignment }: CompensationBadgeProps) {
  const config = {
    within_range: {
      variant: 'success' as const,
      label: 'Within Range',
      tooltip: 'Expectations align with opportunity compensation range',
    },
    above_range: {
      variant: 'warning' as const,
      label: 'Above Range',
      tooltip: 'Expectations may be above the budgeted range',
    },
    below_range: {
      variant: 'default' as const,
      label: 'Below Range',
      tooltip: 'Well within compensation budget',
    },
    unknown: {
      variant: 'default' as const,
      label: 'Unknown',
      tooltip: 'Insufficient data for compensation alignment',
    },
  }

  const { variant, label, tooltip } = config[alignment]

  return (
    <span title={tooltip} className="cursor-help">
      <Badge variant={variant}>{label}</Badge>
    </span>
  )
}

export function formatCompensationAlignment(
  alignment: 'within_range' | 'above_range' | 'below_range' | 'unknown'
): string {
  const labels = {
    within_range: 'Within Range',
    above_range: 'Above Range',
    below_range: 'Below Range',
    unknown: 'Unknown',
  }
  return labels[alignment]
}
