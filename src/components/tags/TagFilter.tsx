import type { Tag } from '../../types'
import { TagChip } from './TagChip'

interface TagFilterProps {
  allTags: Tag[]
  selectedTags: string[]
  onToggle: (tag: string) => void
}

export function TagFilter({ allTags, selectedTags, onToggle }: TagFilterProps) {
  if (allTags.length === 0) return null

  return (
    <div>
      <p className="text-xs text-text-muted mb-2">Filter by tags:</p>
      <div className="flex flex-wrap gap-1.5">
        {allTags.map((tag) => (
          <TagChip
            key={tag.name}
            tag={tag.name}
            color={tag.color}
            onClick={() => onToggle(tag.name)}
            selected={selectedTags.includes(tag.name)}
          />
        ))}
      </div>
    </div>
  )
}
