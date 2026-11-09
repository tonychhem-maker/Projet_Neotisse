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
      useCdn: true,
    })
  : null

const builder = sanityClient ? createImageUrlBuilder(sanityClient) : null

export function urlFor(source) {
  return builder ? builder.image(source) : null
}
