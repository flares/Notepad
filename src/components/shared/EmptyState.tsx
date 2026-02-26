import { Inbox, Bell, Search } from 'lucide-react'

interface EmptyStateProps {
  type?: 'home' | 'followups' | 'search'
  message?: string
}

const configs = {
  home: {
    icon: Inbox,
    title: 'No captures yet',
    message: 'Tap the + button above to capture your first link, note, or idea.',
  },
  followups: {
    icon: Bell,
    title: 'No follow-ups',
    message: 'Mark cards as follow-up to track things you need to revisit.',
  },
  search: {
    icon: Search,
    title: 'No results found',
    message: 'Try different keywords or clear the tag filter.',
  },
}

export function EmptyState({ type = 'home', message }: EmptyStateProps) {
  const config = configs[type]
  const Icon = config.icon
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-surface-elevated flex items-center justify-center mb-4">
        <Icon size={28} className="text-text-muted" />
      </div>
      <h3 className="text-text-secondary font-medium mb-2">{config.title}</h3>
      <p className="text-text-muted text-sm max-w-xs">{message ?? config.message}</p>
    </div>
  )
}
