import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export function useShareTarget() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const title = searchParams.get('title') || ''
    const text = searchParams.get('text') || ''
    const url = searchParams.get('url') || ''

    if (title || text || url) {
      navigate('/share-target', {
        state: { title, text, url },
        replace: true,
      })
    }
  }, [searchParams, navigate])
}
