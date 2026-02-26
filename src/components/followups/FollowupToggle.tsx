import { Bell, BellOff } from 'lucide-react'
import type { Card } from '../../types'
import { toggleFollowup } from '../../hooks/useCards'

interface FollowupToggleProps {
  card: Card
}

export function FollowupToggle({ card }: FollowupToggleProps) {
  const isActive = card.isFollowup && !card.followupCompletedAt

  async function handleToggle(e: React.MouseEvent) {
    e.stopPropagation()
    await toggleFollowup(card.id, card)
  }

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-colors ${
        isActive
          ? 'bg-followup-pending/20 text-followup-pending hover:bg-followup-pending/30'
          : 'bg-surface-hover text-text-secondary hover:bg-surface-hover/80'
      }`}
    >
      {isActive ? <BellOff size={14} /> : <Bell size={14} />}
      {isActive ? 'Remove Follow-up' : 'Mark Follow-up'}
    </button>
  )
}
