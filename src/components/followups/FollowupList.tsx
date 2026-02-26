import { CheckCircle, RotateCcw } from 'lucide-react'
import type { Card, Tag } from '../../types'
import { markFollowupComplete, undoFollowupComplete } from '../../hooks/useCards'
import { TagChipList } from '../tags/TagChip'
import { FollowupBadge } from './FollowupBadge'
import { formatCardDate } from '../../utils/dateFormatter'

interface FollowupCardProps {
  card: Card
  allTags: Tag[]
  onEdit: (id: string) => void
}

export function FollowupCard({ card, allTags, onEdit }: FollowupCardProps) {
  const isCompleted = !!card.followupCompletedAt

  return (
    <div className="bg-surface-card rounded-card shadow-card p-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-xs text-text-muted">{formatCardDate(card.createdAt)}</span>
        <FollowupBadge card={card} />
      </div>

      <p
        className="text-text-primary text-sm mb-3 line-clamp-3 cursor-pointer hover:text-text-secondary transition-colors"
        onClick={() => onEdit(card.id)}
      >
        {card.description}
      </p>

      {card.tags.length > 0 && (
        <div className="mb-3">
          <TagChipList tags={card.tags} allTags={allTags} small />
        </div>
      )}

      {!isCompleted ? (
        <button
          onClick={() => markFollowupComplete(card.id)}
          className="flex items-center gap-2 bg-followup-completed/20 text-followup-completed hover:bg-followup-completed/30 transition-colors px-4 py-2 rounded-xl text-sm font-medium w-full justify-center"
        >
          <CheckCircle size={16} />
          Mark Complete
        </button>
      ) : (
        <button
          onClick={() => undoFollowupComplete(card.id)}
          className="flex items-center gap-2 bg-surface-hover text-text-secondary hover:bg-surface-hover/80 transition-colors px-4 py-2 rounded-xl text-sm w-full justify-center"
        >
          <RotateCcw size={14} />
          Undo Complete
        </button>
      )}
    </div>
  )
}
