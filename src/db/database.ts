import Dexie, { type Table } from 'dexie'
import type { Card, Tag } from '../types'

export class QuickCaptureDB extends Dexie {
  cards!: Table<Card>
  tags!: Table<Tag>

  constructor() {
    super('QuickCaptureDB')

    this.version(1).stores({
      cards: 'id, createdAt, updatedAt, isFollowup, followupCompletedAt, *tags',
      tags: 'name, usageCount',
    })
  }
}

export const db = new QuickCaptureDB()
