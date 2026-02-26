import { useLiveQuery } from 'dexie-react-hooks'
import { v4 as uuidv4 } from 'uuid'
import { db } from '../db/database'
import type { Card } from '../types'
import { extractLinks } from '../utils/linkDetector'

export function useCards() {
  const cards = useLiveQuery(() => db.cards.orderBy('createdAt').reverse().toArray(), [])
  return cards ?? []
}

export function useFollowupCards() {
  const pending = useLiveQuery(
    () => db.cards.where('isFollowup').equals(1).sortBy('createdAt'),
    [],
  )
  const completed = useLiveQuery(
    () =>
      db.cards
        .filter((c) => c.isFollowup && c.followupCompletedAt !== null)
        .sortBy('createdAt'),
    [],
  )
  return {
    pending: (pending ?? []).filter((c) => !c.followupCompletedAt).reverse(),
    completed: (completed ?? []).reverse(),
  }
}

export async function addCard(
  data: Omit<Card, 'id' | 'createdAt' | 'updatedAt' | 'links' | 'isExpanded'>,
): Promise<string> {
  const id = uuidv4()
  const now = new Date().toISOString()
  const links = extractLinks(data.description)
  await db.cards.add({
    ...data,
    id,
    links,
    isExpanded: false,
    createdAt: now,
    updatedAt: now,
  })
  // Update tag usage counts
  for (const tag of data.tags) {
    const existing = await db.tags.get(tag)
    if (existing) {
      await db.tags.update(tag, { usageCount: existing.usageCount + 1 })
    }
  }
  return id
}

export async function updateCard(id: string, data: Partial<Card>): Promise<void> {
  const now = new Date().toISOString()
  if (data.description !== undefined) {
    data.links = extractLinks(data.description)
  }
  await db.cards.update(id, { ...data, updatedAt: now })
}

export async function deleteCard(id: string): Promise<void> {
  const card = await db.cards.get(id)
  if (card) {
    // Decrement tag usage counts
    for (const tag of card.tags) {
      const existing = await db.tags.get(tag)
      if (existing && existing.usageCount > 1) {
        await db.tags.update(tag, { usageCount: existing.usageCount - 1 })
      } else if (existing) {
        await db.tags.delete(tag)
      }
    }
  }
  await db.cards.delete(id)
}

export async function toggleExpanded(id: string, isExpanded: boolean): Promise<void> {
  await db.cards.update(id, { isExpanded })
}

export async function toggleFollowup(id: string, card: Card): Promise<void> {
  if (!card.isFollowup) {
    await db.cards.update(id, { isFollowup: true, followupCompletedAt: null })
  } else if (card.isFollowup && !card.followupCompletedAt) {
    await db.cards.update(id, { followupCompletedAt: new Date().toISOString() })
  } else {
    await db.cards.update(id, { isFollowup: false, followupCompletedAt: null })
  }
}

export async function markFollowupComplete(id: string): Promise<void> {
  await db.cards.update(id, { followupCompletedAt: new Date().toISOString() })
}

export async function undoFollowupComplete(id: string): Promise<void> {
  await db.cards.update(id, { followupCompletedAt: null })
}

export function usePendingFollowupCount(): number {
  const count = useLiveQuery(
    () => db.cards.filter((c) => c.isFollowup && !c.followupCompletedAt).count(),
    [],
  )
  return count ?? 0
}
