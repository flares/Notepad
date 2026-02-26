import { Bell, CheckCircle } from 'lucide-react'
import type { Card } from '../../types'

interface FollowupBadgeProps {
  card: Card
}

export function FollowupBadge({ card }: FollowupBadgeProps) {
  if (!card.isFollowup) return null

  if (card.followupCompletedAt) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-followup-completed font-medium">
        <CheckCircle size={12} />
        Follow-up Completed
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1 text-xs text-followup-pending font-medium">
      <Bell size={12} className="animate-pulse-dot" />
      Follow-up
    </span>
  )
}
