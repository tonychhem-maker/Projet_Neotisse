import { createImageUrlBuilder } from '@sanity/image-url'
import { createClient } from '@sanity/client'

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID
const dataset = import.meta.env.VITE_SANITY_DATASET ?? 'production'

export const isSanityConfigured = Boolean(projectId)

export const sanityClient = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion: '2026-01-01',
      // Le CDN de Sanity garde les requêtes en cache 60 s : pratique en
      // production, pénible en développement où l'on veut voir ses
      // modifications immédiatement. On ne l'active donc pas en mode dev.
      useCdn: !import.meta.env.DEV,
    })
  : null

const builder = sanityClient ? createImageUrlBuilder(sanityClient) : null

export function urlFor(source) {
  return builder ? builder.image(source) : null
}
