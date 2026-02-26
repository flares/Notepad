import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MoreVertical, Download, Upload, Trash2 } from 'lucide-react'
import { exportData, importData, downloadJson } from '../../utils/exportImport'
import { db } from '../../db/database'
import { ConfirmDialog } from '../shared/ConfirmDialog'

interface HeaderProps {
  title?: string
}

export function Header({ title = 'QuickCapture' }: HeaderProps) {
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  async function handleExport() {
    const json = await exportData()
    downloadJson(json, `quickcapture-backup-${new Date().toISOString().slice(0, 10)}.json`)
    setShowMenu(false)
  }

  async function handleImport() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const text = await file.text()
      try {
        const result = await importData(text)
        alert(`Imported ${result.cards} cards and ${result.tags} tags.`)
      } catch {
        alert('Failed to import: invalid file format.')
      }
    }
    input.click()
    setShowMenu(false)
  }

  async function handleClearAll() {
    await db.cards.clear()
    await db.tags.clear()
    setShowClearConfirm(false)
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-20 bg-surface/95 backdrop-blur-sm border-b border-white/5"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="flex items-center justify-between h-14 px-4 max-w-lg mx-auto">
          <h1 className="text-lg font-semibold text-text-primary">{title}</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/search')}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-hover transition-colors text-text-secondary"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-hover transition-colors text-text-secondary"
                aria-label="More options"
              >
                <MoreVertical size={20} />
              </button>

              {showMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                  <div className="absolute right-0 top-10 bg-surface-elevated rounded-xl border border-white/10 shadow-elevated z-50 w-48 overflow-hidden">
                    <button
                      onClick={handleExport}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-text-secondary hover:bg-surface-hover transition-colors"
                    >
                      <Download size={16} />
                      Export Data
                    </button>
                    <button
                      onClick={handleImport}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-text-secondary hover:bg-surface-hover transition-colors"
                    >
                      <Upload size={16} />
                      Import Data
                    </button>
                    <div className="h-px bg-white/5 mx-3" />
                    <button
                      onClick={() => { setShowClearConfirm(true); setShowMenu(false) }}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 size={16} />
                      Clear All Data
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <ConfirmDialog
        isOpen={showClearConfirm}
        title="Clear all data?"
        message="This will permanently delete all your captures and tags. This cannot be undone."
        confirmLabel="Clear All"
        onConfirm={handleClearAll}
        onCancel={() => setShowClearConfirm(false)}
        destructive
      />
    </>
  )
}
