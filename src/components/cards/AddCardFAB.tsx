import { Plus } from 'lucide-react'

interface AddCardFABProps {
  onClick: () => void
}

export function AddCardFAB({ onClick }: AddCardFABProps) {
  return (
    <button
      onClick={onClick}
      className="fab shadow-fab transition-transform hover:scale-105 active:scale-95"
      aria-label="Add new capture"
    >
      <Plus size={24} className="text-white" />
    </button>
  )
}
