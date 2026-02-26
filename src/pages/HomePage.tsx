import { useState, useRef, useEffect } from 'react'
import { useCards } from '../hooks/useCards'
import { useTags } from '../hooks/useTags'
import { AddNewCard } from '../components/cards/AddNewCard'
import { AddCardFAB } from '../components/cards/AddCardFAB'
import { AddCardForm } from '../components/cards/AddCardForm'
import { CardList } from '../components/cards/CardList'
import type { Card } from '../types'

export function HomePage() {
  const cards = useCards()
  const allTags = useTags()
  const [showForm, setShowForm] = useState(false)
  const [editCard, setEditCard] = useState<Card | null>(null)
  const [showFAB, setShowFAB] = useState(false)
  const addCardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowFAB(!entry.isIntersecting),
      { threshold: 0.1 },
    )
    if (addCardRef.current) observer.observe(addCardRef.current)
    return () => observer.disconnect()
  }, [])

  function handleEdit(id: string) {
    const card = cards.find((c) => c.id === id) ?? null
    setEditCard(card)
    setShowForm(true)
  }

  function handleCloseForm() {
    setShowForm(false)
    setEditCard(null)
  }

  return (
    <>
      <div className="py-4 space-y-3">
        <div ref={addCardRef}>
          <AddNewCard onClick={() => setShowForm(true)} />
        </div>
        <CardList cards={cards} allTags={allTags} onEdit={handleEdit} />
      </div>

      {showFAB && <AddCardFAB onClick={() => setShowForm(true)} />}

      {showForm && (
        <AddCardForm
          onClose={handleCloseForm}
          editCard={editCard}
        />
      )}
    </>
  )
}
