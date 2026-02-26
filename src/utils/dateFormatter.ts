import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns'

export function formatCardDate(isoString: string): string {
  const date = new Date(isoString)
  if (isToday(date)) {
    return `Today · ${format(date, 'h:mm a')}`
  }
  if (isYesterday(date)) {
    return `Yesterday · ${format(date, 'h:mm a')}`
  }
  return format(date, 'MMM d, yyyy · h:mm a')
}

export function formatRelative(isoString: string): string {
  return formatDistanceToNow(new Date(isoString), { addSuffix: true })
}

export function formatAbsolute(isoString: string): string {
  return format(new Date(isoString), 'MMM d, yyyy h:mm a')
}
