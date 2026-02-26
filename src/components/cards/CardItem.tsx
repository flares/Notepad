import { useState } from 'react'
import { ChevronDown, ChevronUp, Edit2, Trash2 } from 'lucide-react'
import type { Card, Tag } from '../../types'
import { toggleExpanded, deleteCard } from '../../hooks/useCards'
import { TagChipList } from '../tags/TagChip'
import { FollowupBadge } from '../followups/FollowupBadge'
import { FollowupToggle } from '../followups/FollowupToggle'
import { LinkRenderer, LinkItem } from '../shared/LinkRenderer'
import { ConfirmDialog } from '../shared/ConfirmDialog'
import { formatCardDate, formatAbsolute } from '../../utils/dateFormatter'

interface CardItemProps {
  card: Card
  allTags: Tag[]
  onEdit: (id: string) => void
}

export function CardItem({ card, allTags, onEdit }: CardItemProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  function handleChevronClick(e: React.MouseEvent) {
    e.stopPropagation()
    toggleExpanded(card.id, !card.isExpanded)
  }

  async function handleDelete() {
    await deleteCard(card.id)
    setShowDeleteConfirm(false)
  }

  return (
    <>
      <div className="bg-surface-card rounded-card shadow-card overflow-hidden">
        {/* Card header */}
        <div className="px-4 pt-3 pb-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-text-muted">{formatCardDate(card.createdAt)}</span>
            {card.sharedFrom && (
              <span className="text-xs text-text-muted italic">via {card.sharedFrom}</span>
            )}
          </div>
        </div>

        {/* Collapsed content (always visible) */}
        <div className="px-4 pb-2">
          {/* Description preview */}
          <div className={`text-text-primary text-sm mb-2 ${!card.isExpanded ? 'line-clamp-3' : ''}`}>
            <LinkRenderer text={card.description} />
          </div>

          {/* First link preview in collapsed state */}
          {!card.isExpanded && card.links.length > 0 && (
            <div className="mb-2">
              <LinkItem url={card.links[0]} />
            </div>
          )}

          {/* Tags row */}
          {card.tags.length > 0 && (
            <div className="mb-2">
              <TagChipList tags={card.tags} allTags={allTags} small maxVisible={card.isExpanded ? undefined : 5} />
            </div>
          )}

          {/* Followup badge */}
          {card.isFollowup && (
            <div className="mb-2">
              <FollowupBadge card={card} />
            </div>
          )}
        </div>

        {/* Expanded content */}
        <div className={`card-content-grid ${card.isExpanded ? 'expanded' : ''}`}>
          <div className="card-content-inner">
            <div className="px-4 pb-2 border-t border-white/5 pt-3">
              {/* All links */}
              {card.links.length > 1 && (
                <div className="mb-3">
                  <p className="text-xs text-text-muted mb-1">Links ({card.links.length})</p>
                  {card.links.map((link, i) => (
                    <LinkItem key={i} url={link} />
                  ))}
                </div>
              )}

              {/* Shared URL if different from detected links */}
              {card.sharedUrl && !card.links.includes(card.sharedUrl) && (
                <div className="mb-3">
                  <p className="text-xs text-text-muted mb-1">Shared URL</p>
                  <LinkItem url={card.sharedUrl} />
                </div>
              )}

              {/* Follow-up controls */}
              <div className="mb-3">
                <FollowupToggle card={card} />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={(e) => { e.stopPropagation(); onEdit(card.id) }}
                  className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-surface-hover text-text-secondary hover:text-text-primary transition-colors"
                >
                  <Edit2 size={14} />
                  Edit
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(true) }}
                  className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>

              {/* Timestamps */}
              <div className="text-xs text-text-muted space-y-0.5">
                <div>Created: {formatAbsolute(card.createdAt)}</div>
                {card.updatedAt !== card.createdAt && (
                  <div>Updated: {formatAbsolute(card.updatedAt)}</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Chevron - bottom-left per spec */}
        <div className="px-4 py-2 flex items-center">
          <button
            onClick={handleChevronClick}
            className="flex items-center gap-1 text-text-muted hover:text-text-secondary transition-colors text-xs"
            aria-label={card.isExpanded ? 'Collapse card' : 'Expand card'}
          >
            {card.isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            <span>{card.isExpanded ? 'Less' : 'More'}</span>
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete capture?"
        message="This cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        destructive
      />
    </>
  )
}
