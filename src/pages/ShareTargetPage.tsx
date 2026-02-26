import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Save, ExternalLink } from 'lucide-react'
import { addCard } from '../hooks/useCards'
import { useTags, ensureTag } from '../hooks/useTags'
import { TagInput } from '../components/tags/TagInput'
import { detectSourceFromUrl } from '../utils/linkDetector'

interface SharedState {
  title?: string
  text?: string
  url?: string
}

export function ShareTargetPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const shared = (location.state as SharedState) ?? {}
  const allTags = useTags()

  const sharedFrom = shared.url ? detectSourceFromUrl(shared.url) : null
  const [notes, setNotes] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [isFollowup, setIsFollowup] = useState(false)
  const [saving, setSaving] = useState(false)
  const notesRef = useRef<HTMLTextAreaElement>(null)

  // Also parse from search params (when opened directly from share sheet)
  const params = new URLSearchParams(location.search)
  const paramTitle = params.get('title') ?? shared.title ?? ''
  const paramText = params.get('text') ?? shared.text ?? ''
  const paramUrl = params.get('url') ?? shared.url ?? ''

  useEffect(() => {
    notesRef.current?.focus()
  }, [])

  async function handleSave() {
    setSaving(true)
    try {
      for (const tag of tags) await ensureTag(tag)

      const description = [
        paramTitle && `Title: ${paramTitle}`,
        paramText,
        notes.trim(),
      ]
        .filter(Boolean)
        .join('\n\n')

      await addCard({
        description: description || paramUrl,
        tags,
        isFollowup,
        followupCompletedAt: null,
        sharedFrom,
        sharedUrl: paramUrl || null,
        sharedTitle: paramTitle || null,
      })
      navigate('/', { replace: true })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="flex items-center gap-3 px-4 h-14 border-b border-white/10 bg-surface/95 backdrop-blur-sm"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <button
          onClick={() => navigate('/', { replace: true })}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-hover transition-colors text-text-secondary"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-base font-semibold text-text-primary">
          {sharedFrom ? `Shared from ${sharedFrom}` : 'Shared Content'}
        </h1>
      </header>

      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {/* Shared content preview */}
        {(paramTitle || paramUrl || paramText) && (
          <div className="bg-surface-card rounded-card p-4 border border-white/10">
            {paramTitle && (
              <p className="text-sm font-medium text-text-primary mb-2">{paramTitle}</p>
            )}
            {paramUrl && (
              <a
                href={paramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-accent text-sm underline break-all mb-2"
              >
                <ExternalLink size={14} className="shrink-0" />
                {paramUrl}
              </a>
            )}
            {paramText && paramText !== paramUrl && (
              <p className="text-sm text-text-secondary">{paramText}</p>
            )}
          </div>
        )}

        {/* User notes */}
        <div>
          <label className="text-xs text-text-muted block mb-1.5">Your Notes:</label>
          <textarea
            ref={notesRef}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add your thoughts here..."
            rows={4}
            className="w-full bg-surface-elevated rounded-xl border border-white/10 focus:border-primary/60 focus:outline-none text-text-primary placeholder-text-muted text-sm p-3 resize-none transition-colors"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="text-xs text-text-muted block mb-1.5">Tags:</label>
          <TagInput tags={tags} allTags={allTags} onChange={setTags} />
        </div>

        {/* Follow-up */}
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isFollowup}
            onChange={(e) => setIsFollowup(e.target.checked)}
            className="w-4 h-4 rounded accent-primary"
          />
          <span className="text-sm text-text-secondary">Mark as Follow-up</span>
        </label>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={saving || (!paramUrl && !paramText && !paramTitle && !notes.trim())}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-colors"
        >
          <Save size={18} />
          {saving ? 'Saving...' : 'Save & Close'}
        </button>

        {/* iOS install hint */}
        <p className="text-xs text-text-muted text-center">
          Install QuickCapture to your Home Screen to enable sharing from any app
        </p>
      </div>
    </div>
  )
}
