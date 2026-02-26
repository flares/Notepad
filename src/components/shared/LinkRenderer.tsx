import { ExternalLink } from 'lucide-react'
import { truncateUrl } from '../../utils/linkDetector'

const URL_REGEX = /(https?:\/\/[^\s<>"{}|\\^`[\]]+)/gi

interface LinkRendererProps {
  text: string
  className?: string
}

export function LinkRenderer({ text, className = '' }: LinkRendererProps) {
  const parts = text.split(URL_REGEX)
  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (URL_REGEX.test(part)) {
          URL_REGEX.lastIndex = 0
          return (
            <a
              key={i}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline hover:text-accent-light inline-flex items-center gap-0.5 break-all"
              onClick={(e) => e.stopPropagation()}
            >
              {truncateUrl(part, 60)}
              <ExternalLink size={12} className="shrink-0" />
            </a>
          )
        }
        URL_REGEX.lastIndex = 0
        return <span key={i}>{part}</span>
      })}
    </span>
  )
}

interface LinkItemProps {
  url: string
  className?: string
}

export function LinkItem({ url, className = '' }: LinkItemProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-1.5 text-accent hover:text-accent-light text-sm py-1 break-all ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      <ExternalLink size={14} className="shrink-0 mt-0.5" />
      <span className="underline">{truncateUrl(url, 70)}</span>
    </a>
  )
}
