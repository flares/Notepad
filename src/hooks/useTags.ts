import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/database'
import type { Tag } from '../types'

export const TAG_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
  '#f59e0b', '#10b981', '#06b6d4', '#3b82f6',
  '#14b8a6', '#a855f7',
]

function randomTagColor(): string {
  return TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)]
}

export function useTags(): Tag[] {
  const tags = useLiveQuery(() => db.tags.orderBy('usageCount').reverse().toArray(), [])
  return tags ?? []
}

export async function ensureTag(name: string): Promise<Tag> {
  const normalized = name.toLowerCase().trim()
  const existing = await db.tags.get(normalized)
  if (existing) return existing
  const tag: Tag = {
    name: normalized,
    color: randomTagColor(),
    usageCount: 0,
    createdAt: new Date().toISOString(),
  }
  await db.tags.add(tag)
  return tag
}

export async function getTagColor(name: string): Promise<string> {
  const tag = await db.tags.get(name.toLowerCase().trim())
  return tag?.color ?? randomTagColor()
}

export function getTagColorSync(name: string, allTags: Tag[]): string {
  const tag = allTags.find((t) => t.name === name.toLowerCase().trim())
  return tag?.color ?? TAG_COLORS[Math.abs(hashString(name)) % TAG_COLORS.length]
}

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return hash
}
