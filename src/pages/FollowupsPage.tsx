import { useState } from 'react'
import { useFollowupCards } from '../hooks/useCards'
import { useTags } from '../hooks/useTags'
import { FollowupCard } from '../components/followups/FollowupList'
import { EmptyState } from '../components/shared/EmptyState'
import { AddCardForm } from '../components/cards/AddCardForm'
import type { Card } from '../types'

type Tab = 'pending' | 'completed'

export function FollowupsPage() {
  const { pending, completed } = useFollowupCards()
  const allTags = useTags()
  const [tab, setTab] = useState<Tab>('pending')
  const [editCard, setEditCard] = useState<Card | null>(null)

  function handleEdit(id: string) {
    const all = [...pending, ...completed]
    const card = all.find((c) => c.id === id) ?? null
    setEditCard(card)
  }

  const current = tab === 'pending' ? pending : completed

  return (
    <>
      <div className="py-4">
        {/* Tabs */}
        <div className="flex gap-1 bg-surface-elevated rounded-xl p-1 mb-4">
          <button
            onClick={() => setTab('pending')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === 'pending'
                ? 'bg-primary text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Pending ({pending.length})
          </button>
          <button
            onClick={() => setTab('completed')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === 'completed'
                ? 'bg-primary text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Completed ({completed.length})
          </button>
        </div>

        {current.length === 0 ? (
          <EmptyState
            type="followups"
            message={
              tab === 'pending'
                ? 'No pending follow-ups. Mark cards as follow-up to track them here.'
                : 'No completed follow-ups yet.'
            }
          />
        ) : (
          <div className="space-y-3">
            {current.map((card) => (
              <FollowupCard key={card.id} card={card} allTags={allTags} onEdit={handleEdit} />
            ))}
          </div>
        )}
      </div>

      {editCard && (
        <AddCardForm onClose={() => setEditCard(null)} editCard={editCard} />
      )}
    </>
  )
}
