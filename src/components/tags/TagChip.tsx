import { X } from 'lucide-react'
import type { Tag } from '../../types'

interface TagChipProps {
  tag: string
  color?: string
  onRemove?: () => void
  onClick?: () => void
  selected?: boolean
  small?: boolean
}

export function TagChip({ tag, color, onRemove, onClick, selected, small }: TagChipProps) {
  const bg = color ? `${color}22` : '#6366f122'
  const border = color ?? '#6366f1'

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-chip font-medium select-none
        ${small ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1'}
        ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
        ${selected ? 'ring-1 ring-white/40' : ''}`}
      style={{ backgroundColor: bg, borderColor: border, border: `1px solid ${border}40`, color: border }}
    >
      {tag}
      {onRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove() }}
          className="ml-0.5 hover:opacity-70 transition-opacity"
          aria-label={`Remove tag ${tag}`}
        >
          <X size={10} />
        </button>
      )}
    </span>
  )
}

interface TagChipListProps {
  tags: string[]
  allTags: Tag[]
  onRemove?: (tag: string) => void
  onTagClick?: (tag: string) => void
  selectedTags?: string[]
  small?: boolean
  maxVisible?: number
}

export function TagChipList({
  tags,
  allTags,
  onRemove,
  onTagClick,
  selectedTags = [],
  small,
  maxVisible,
}: TagChipListProps) {
  const visible = maxVisible ? tags.slice(0, maxVisible) : tags
  const hidden = maxVisible ? tags.length - maxVisible : 0

  return (
    <div className="flex flex-wrap gap-1.5">
      {visible.map((tag) => {
        const tagData = allTags.find((t) => t.name === tag)
        return (
          <TagChip
            key={tag}
            tag={tag}
            color={tagData?.color}
            onRemove={onRemove ? () => onRemove(tag) : undefined}
            onClick={onTagClick ? () => onTagClick(tag) : undefined}
            selected={selectedTags.includes(tag)}
            small={small}
          />
        )
      })}
      {hidden > 0 && (
        <span className="text-xs text-text-muted px-1.5 py-0.5">+{hidden}</span>
      )}
    </div>
  )
}
