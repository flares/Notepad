import { useState, useRef, type KeyboardEvent } from 'react'
import { Plus } from 'lucide-react'
import type { Tag } from '../../types'
import { TagChip } from './TagChip'
import { ensureTag } from '../../hooks/useTags'

interface TagInputProps {
  tags: string[]
  allTags: Tag[]
  onChange: (tags: string[]) => void
  maxTags?: number
}

export function TagInput({ tags, allTags, onChange, maxTags = 10 }: TagInputProps) {
  const [input, setInput] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const suggestions = allTags
    .filter(
      (t) =>
        t.name.includes(input.toLowerCase().trim()) &&
        !tags.includes(t.name) &&
        input.trim().length > 0,
    )
    .slice(0, 6)

  async function addTag(name: string) {
    const normalized = name.toLowerCase().trim()
    if (!normalized || tags.includes(normalized) || tags.length >= maxTags) return
    await ensureTag(normalized)
    onChange([...tags, normalized])
    setInput('')
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  function removeTag(tag: string) {
    onChange(tags.filter((t) => t !== tag))
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault()
      addTag(input)
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      onChange(tags.slice(0, -1))
    }
  }

  return (
    <div className="relative">
      <div
        className="flex flex-wrap gap-1.5 p-2 bg-surface rounded-xl border border-white/10 focus-within:border-primary/60 transition-colors min-h-[42px] cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag) => {
          const tagData = allTags.find((t) => t.name === tag)
          return (
            <TagChip key={tag} tag={tag} color={tagData?.color} onRemove={() => removeTag(tag)} />
          )
        })}
        {tags.length < maxTags && (
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              setShowSuggestions(true)
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            placeholder={tags.length === 0 ? '+ Add tag...' : ''}
            className="flex-1 min-w-[80px] bg-transparent text-sm text-text-primary placeholder-text-muted outline-none"
          />
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-surface-elevated rounded-xl border border-white/10 shadow-elevated z-20 overflow-hidden">
          {suggestions.map((tag) => (
            <button
              key={tag.name}
              onMouseDown={(e) => { e.preventDefault(); addTag(tag.name) }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-surface-hover transition-colors flex items-center gap-2"
            >
              <Plus size={12} className="text-text-muted" />
              <span style={{ color: tag.color }}>{tag.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
