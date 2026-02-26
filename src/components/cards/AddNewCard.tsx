import { Plus } from 'lucide-react'

interface AddNewCardProps {
  onClick: () => void
}

export function AddNewCard({ onClick }: AddNewCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-4 rounded-card border-2 border-dashed border-primary/40 hover:border-primary/70 hover:bg-primary/5 transition-all text-left group"
    >
      <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/30 transition-colors">
        <Plus size={20} className="text-primary" />
      </div>
      <div>
        <p className="text-text-primary font-medium text-sm">Add New Capture</p>
        <p className="text-text-muted text-xs">Tap to capture a link, note, or idea</p>
      </div>
    </button>
  )
}
