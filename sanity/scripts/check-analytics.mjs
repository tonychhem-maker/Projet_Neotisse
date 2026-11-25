// Lecture de nos statistiques avec la session Sanity du poste (jeton jamais affiché).
// sanity exec scripts/check-analytics.mjs --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2025-02-19' }).withConfig({ useCdn: false, perspective: 'raw' })
const rows = await client.fetch(
  '*[_type == "analyticsDaily"] | order(day desc)[0...7] { day, views, visits, received, pages, sources, events }',
)
console.log(JSON.stringify(rows, null, 2))
