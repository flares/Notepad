import { NavLink } from 'react-router-dom'
import { Home, Bell, Search } from 'lucide-react'
import { usePendingFollowupCount } from '../../hooks/useCards'

export function BottomNav() {
  const pendingCount = usePendingFollowupCount()

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/followups', icon: Bell, label: 'Followups', badge: pendingCount },
    { to: '/search', icon: Search, label: 'Search' },
  ]

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-surface-elevated border-t border-white/10 z-30"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map(({ to, icon: Icon, label, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-3 px-6 transition-colors relative
               ${isActive ? 'text-primary' : 'text-text-muted hover:text-text-secondary'}`
            }
          >
            <div className="relative">
              <Icon size={22} />
              {badge !== undefined && badge > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-followup-pending text-white text-[10px] rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 font-medium">
                  {badge > 99 ? '99+' : badge}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
