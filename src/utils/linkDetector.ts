const URL_REGEX = /(https?:\/\/[^\s<>"{}|\\^`[\]]+)/gi

export function extractLinks(text: string): string[] {
  const matches = text.match(URL_REGEX)
  return matches ? [...new Set(matches)] : []
}

export function truncateUrl(url: string, maxLen = 50): string {
  if (url.length <= maxLen) return url
  try {
    const u = new URL(url)
    const base = u.hostname + u.pathname
    if (base.length <= maxLen) return base
    return base.slice(0, maxLen - 3) + '...'
  } catch {
    return url.slice(0, maxLen - 3) + '...'
  }
}

export function detectSourceFromUrl(url: string): string | null {
  try {
    const hostname = new URL(url).hostname
    if (hostname.includes('twitter.com') || hostname.includes('x.com')) return 'X / Twitter'
    if (hostname.includes('reddit.com')) return 'Reddit'
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) return 'YouTube'
    if (hostname.includes('github.com')) return 'GitHub'
    if (hostname.includes('linkedin.com')) return 'LinkedIn'
    if (hostname.includes('instagram.com')) return 'Instagram'
    return hostname.replace('www.', '')
  } catch {
    return null
  }
}
