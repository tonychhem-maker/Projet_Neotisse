import { useEffect, useState } from 'react'
import { isSanityConfigured, sanityClient } from '../lib/sanity'

// Charge un document Sanity unique (singleton) défini par `query`.
// En attendant la connexion au CMS, `fallback` sert de contenu de prévisualisation.
export function useSanityDocument(query, fallback = null) {
  const [data, setData] = useState(fallback)
  const [loading, setLoading] = useState(isSanityConfigured)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!sanityClient) return

    let cancelled = false

    sanityClient
      .fetch(query)
      .then((result) => {
        if (cancelled) return
        if (result) setData(result)
        setLoading(false)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err)
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [query])

  return { data, loading, error }
}
