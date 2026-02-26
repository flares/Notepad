import { useState, useEffect, useRef } from 'react'
import { X, Save } from 'lucide-react'
import type { Card } from '../../types'
import { addCard, updateCard } from '../../hooks/useCards'
import { useTags, ensureTag } from '../../hooks/useTags'
import { TagInput } from '../tags/TagInput'
import { extractLinks } from '../../utils/linkDetector'
import { LinkItem } from '../shared/LinkRenderer'

interface AddCardFormProps {
  onClose: () => void
  editCard?: Card | null
  prefill?: {
    description?: string
    sharedFrom?: string
    sharedUrl?: string
    sharedTitle?: string
  }
}

export function AddCardForm({ onClose, editCard, prefill }: AddCardFormProps) {
  const allTags = useTags()
  const [description, setDescription] = useState(
    editCard?.description ?? prefill?.description ?? '',
  )
  const [tags, setTags] = useState<string[]>(editCard?.tags ?? [])
  const [isFollowup, setIsFollowup] = useState(editCard?.isFollowup ?? false)
  const [saving, setSaving] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const detectedLinks = extractLinks(description)

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  function autoResize() {
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = `${el.scrollHeight}px`
    }
  }

  async function handleSave() {
    if (!description.trim()) return
    setSaving(true)

    try {
      for (const tag of tags) {
        await ensureTag(tag)
      }

      if (editCard) {
        await updateCard(editCard.id, {
          description: description.trim(),
          tags,
          isFollowup,
          followupCompletedAt: isFollowup ? editCard.followupCompletedAt : null,
        })
      } else {
        await addCard({
          description: description.trim(),
          tags,
          isFollowup,
          followupCompletedAt: null,
          sharedFrom: prefill?.sharedFrom ?? null,
          sharedUrl: prefill?.sharedUrl ?? null,
          sharedTitle: prefill?.sharedTitle ?? null,
        })
      }
      onClose()
    } finally {
      setSaving(false)
    }
  }

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="bottom-sheet-backdrop" onClick={handleBackdropClick}>
      <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        <div className="px-4 pb-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text-primary">
              {editCard ? 'Edit Capture' : 'New Capture'}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-hover transition-colors text-text-muted"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Shared content preview */}
          {prefill?.sharedUrl && (
            <div className="mb-3 p-3 bg-surface rounded-xl border border-white/10">
              {prefill.sharedFrom && (
                <p className="text-xs text-text-muted mb-1">Shared from {prefill.sharedFrom}</p>
              )}
              {prefill.sharedTitle && (
                <p className="text-sm text-text-secondary mb-1">{prefill.sharedTitle}</p>
              )}
              <LinkItem url={prefill.sharedUrl} />
            </div>
          )}

          {/* Description textarea */}
          <textarea
            ref={textareaRef}
            value={description}
            onChange={(e) => { setDescription(e.target.value); autoResize() }}
            onInput={autoResize}
            placeholder="What's on your mind? Paste links, write notes, save ideas..."
            rows={4}
            className="w-full bg-surface rounded-xl border border-white/10 focus:border-primary/60 focus:outline-none text-text-primary placeholder-text-muted text-sm p-3 resize-none transition-colors"
          />

          {/* Detected links */}
          {detectedLinks.length > 0 && (
            <div className="mt-2 mb-3">
              <p className="text-xs text-text-muted mb-1">Detected links:</p>
              {detectedLinks.map((link, i) => (
                <LinkItem key={i} url={link} />
              ))}
            </div>
          )}

          {/* Tags */}
          <div className="mt-3 mb-3">
            <label className="text-xs text-text-muted block mb-1.5">Tags:</label>
            <TagInput tags={tags} allTags={allTags} onChange={setTags} />
          </div>

          {/* Follow-up checkbox */}
          <label className="flex items-center gap-2.5 cursor-pointer mb-4 select-none">
            <input
              type="checkbox"
              checked={isFollowup}
              onChange={(e) => setIsFollowup(e.target.checked)}
              className="w-4 h-4 rounded accent-primary"
            />
            <span className="text-sm text-text-secondary">Mark as Follow-up</span>
          </label>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={!description.trim() || saving}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-colors"
          >
            <Save size={18} />
            {saving ? 'Saving...' : editCard ? 'Save Changes' : 'Save Capture'}
          </button>
        </div>
      </div>
    </div>
  )
}
