import type { Card, Tag } from '../../types'
import { CardItem } from './CardItem'
import { EmptyState } from '../shared/EmptyState'

interface CardListProps {
  cards: Card[]
  allTags: Tag[]
  onEdit: (id: string) => void
  emptyType?: 'home' | 'followups' | 'search'
}

export function CardList({ cards, allTags, onEdit, emptyType = 'home' }: CardListProps) {
  if (cards.length === 0) {
    return <EmptyState type={emptyType} />
  }

  return (
    <div className="flex flex-col gap-3">
      {cards.map((card) => (
        <CardItem key={card.id} card={card} allTags={allTags} onEdit={onEdit} />
      ))}
    </div>
  )
}
