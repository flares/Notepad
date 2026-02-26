import { useState, useMemo, useCallback } from 'react'
import { useCards } from './useCards'
import type { Card } from '../types'

export function useSearch() {
  const allCards = useCards()
  const [query, setQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const results = useMemo(() => {
    let filtered = [...allCards]

    if (selectedTags.length > 0) {
      filtered = filtered.filter((card) =>
        selectedTags.every((tag) => card.tags.includes(tag)),
      )
    }

    if (query.trim()) {
      const q = query.toLowerCase().trim()
      filtered = filtered.filter(
        (card) =>
          card.description.toLowerCase().includes(q) ||
          card.tags.some((t) => t.includes(q)) ||
          card.links.some((l) => l.toLowerCase().includes(q)) ||
          (card.sharedTitle?.toLowerCase().includes(q) ?? false),
      )
    }

    return filtered
  }, [allCards, query, selectedTags])

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    )
  }, [])

  const clearSearch = useCallback(() => {
    setQuery('')
    setSelectedTags([])
  }, [])

  return { query, setQuery, selectedTags, toggleTag, clearSearch, results }
}

export function scoreCard(card: Card, query: string): number {
  const q = query.toLowerCase()
  let score = 0
  if (card.description.toLowerCase().startsWith(q)) score += 10
  if (card.description.toLowerCase().includes(q)) score += 5
  if (card.tags.some((t) => t === q)) score += 8
  if (card.tags.some((t) => t.includes(q))) score += 3
  return score
}
