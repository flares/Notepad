export interface Card {
  id: string
  description: string
  links: string[]
  tags: string[]
  isFollowup: boolean
  followupCompletedAt: string | null
  createdAt: string
  updatedAt: string
  sharedFrom: string | null
  sharedUrl: string | null
  sharedTitle: string | null
  isExpanded: boolean
}

export interface Tag {
  name: string
  color: string
  usageCount: number
  createdAt: string
}

export interface ShareData {
  title: string
  text: string
  url: string
}
