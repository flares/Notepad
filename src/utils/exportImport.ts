import { db } from '../db/database'

export async function exportData(): Promise<string> {
  const cards = await db.cards.toArray()
  const tags = await db.tags.toArray()
  return JSON.stringify(
    { version: 1, exportedAt: new Date().toISOString(), cards, tags },
    null,
    2,
  )
}

export async function importData(json: string): Promise<{ cards: number; tags: number }> {
  const data = JSON.parse(json) as { version: number; cards: unknown[]; tags: unknown[] }
  if (data.version !== 1) throw new Error('Unsupported export version')
  await db.transaction('rw', db.cards, db.tags, async () => {
    for (const card of data.cards) await db.cards.put(card as Parameters<typeof db.cards.put>[0])
    for (const tag of data.tags) await db.tags.put(tag as Parameters<typeof db.tags.put>[0])
  })
  return { cards: data.cards.length, tags: data.tags.length }
}

export function downloadJson(content: string, filename: string) {
  const blob = new Blob([content], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
