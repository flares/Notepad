import { useRef, useEffect, useState } from 'react'
import { X, Search } from 'lucide-react'
import { useSearch } from '../hooks/useSearch'
import { useTags } from '../hooks/useTags'
import { TagFilter } from '../components/tags/TagFilter'
import { CardList } from '../components/cards/CardList'
import { AddCardForm } from '../components/cards/AddCardForm'
import type { Card } from '../types'

export function SearchPage() {
  const allTags = useTags()
  const { query, setQuery, selectedTags, toggleTag, clearSearch, results } = useSearch()
  const inputRef = useRef<HTMLInputElement>(null)
  const [editCard, setEditCard] = useState<Card | null>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  function handleEdit(id: string) {
    const card = results.find((c) => c.id === id) ?? null
    setEditCard(card)
  }

  const hasFilter = query.trim() || selectedTags.length > 0

  return (
    <>
      <div className="py-4 space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cards..."
            className="w-full bg-surface-elevated rounded-xl border border-white/10 focus:border-primary/60 focus:outline-none text-text-primary placeholder-text-muted text-sm pl-10 pr-10 py-3 transition-colors"
          />
          {hasFilter && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Tag filter */}
        {allTags.length > 0 && (
          <TagFilter allTags={allTags} selectedTags={selectedTags} onToggle={toggleTag} />
        )}

        {/* Results */}
        {hasFilter && (
          <p className="text-xs text-text-muted">
            {results.length} {results.length === 1 ? 'result' : 'results'}
          </p>
        )}

        <CardList
          cards={hasFilter ? results : []}
          allTags={allTags}
          onEdit={handleEdit}
          emptyType={hasFilter ? 'search' : 'home'}
        />

        {!hasFilter && (
          <p className="text-center text-text-muted text-sm py-8">
            Start typing to search across all your captures
          </p>
        )}
      </div>

      {editCard && (
        <AddCardForm onClose={() => setEditCard(null)} editCard={editCard} />
      )}
    </>
  )
}
