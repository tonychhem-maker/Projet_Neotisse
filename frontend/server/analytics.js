import { createHash } from 'node:crypto'

export const DAILY_LIMIT = 5000
export const SESSION_LIMIT = 200
export const DAILY_VISIT_LIMIT = 500
export const RETENTION_DAYS = 90
const UUID = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i
const PAGES = new Set(['/', '/ateliers-de-mediation-textile', '/a-propos', '/actualites', '/deplacements', '/partenaires', '/contact', '/livre-d-or', '/livre-d-or/laisser-un-mot', '/mentions-legales', '/politique-de-confidentialite', '/politique-de-cookies'])
export const SOURCES = ['direct', 'google', 'bing', 'facebook', 'instagram', 'linkedin', 'other']
// pageview n'est pas une action : elle alimente le compteur de pages vues.
// Les conversions sont sans donnée personnelle : on sait qu'un message est parti, jamais son contenu.
export const EVENTS = ['pageview', 'contact_click', 'contact_submit', 'testimonial_open', 'testimonial_submit', 'workshop_open', 'article_open']
// Clics d'intention (avant remplissage d'un formulaire).
export const CLICKS = new Set(['contact_click', 'testimonial_open', 'workshop_open', 'article_open'])

export function normalizePath(value) {
  if (typeof value !== 'string' || value.length > 180) return null
  const path = value.split(/[?#]/)[0].replace(/\/$/, '') || '/'
  return PAGES.has(path) || /^\/actualites\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(path) ? path : null
}

export function validateEvent(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null
  const path = normalizePath(body.path)
  if (!path || !UUID.test(body.sessionId) || !UUID.test(body.id) || !EVENTS.includes(body.kind)) return null
  if (body.consent !== true) return null
  return { path, id: body.id.toLowerCase(), sessionId: body.sessionId.toLowerCase(), kind: body.kind, source: SOURCES.includes(body.source) ? body.source : 'direct' }
}

export function idsFor(event, now = new Date()) {
  const day = now.toISOString().slice(0, 10)
  const hash = createHash('sha256').update(`${day}:${event.sessionId}`).digest('hex').slice(0, 40)
  // Les identifiants avec sous-chemin ne sont pas lisibles anonymement dans Sanity.
  return { day, dailyId: `analytics.daily.${day}`, visitId: `analytics.visit.${day}.${hash}` }
}

export function nextDocuments(event, daily, visit, now = new Date()) {
  const { day, dailyId, visitId } = idsFor(event, now)
  if (visit?.eventIds?.includes(event.id)) return { status: 'duplicate' }
  if ((daily?.received ?? 0) >= DAILY_LIMIT || (visit?.eventIds?.length ?? 0) >= SESSION_LIMIT) return { status: 'limited' }
  const newVisit = !visit
  // « Engagée » : la visite a produit un message ou une demande, pas seulement un clic d'intention.
  const engagement = event.kind !== 'pageview' && !CLICKS.has(event.kind)
  const newEngagement = engagement && !visit?.engaged
  if (newVisit && (daily?.visits ?? 0) >= DAILY_VISIT_LIMIT) return { status: 'limited' }
  const next = structuredClone(daily ?? { _id: dailyId, _type: 'analyticsDaily', day, received: 0, views: 0, visits: 0, engagedVisits: 0, pages: [], sources: [], events: [] })
  next.received += 1
  next.visits += newVisit ? 1 : 0
  if (newVisit) increment(next.sources, event.source, 'source')
  if (newEngagement) next.engagedVisits = (next.engagedVisits ?? 0) + 1
  if (event.kind === 'pageview') {
    next.views += 1
    const path = next.pages.length >= 100 && !next.pages.some(p => p.path === event.path) ? '/autres-pages' : event.path
    increment(next.pages, path, 'path')
  } else increment(next.events, event.kind, 'kind')
  const session = { _id: visitId, _type: 'analyticsVisit', day, engaged: Boolean(visit?.engaged) || newEngagement, eventIds: [...(visit?.eventIds ?? []), event.id] }
  return { status: 'counted', daily: next, visit: session }
}

function increment(array, value, field) {
  const existing = array.find(item => item[field] === value)
  if (existing) existing.count += 1
  else array.push({ _key: createHash('sha256').update(value).digest('hex').slice(0, 24), [field]: value, count: 1 })
}

function writeDocument(transaction, previous, next) {
  const { _id, _type, _rev, _createdAt, _updatedAt, ...fields } = next
  if (!previous) return transaction.create({ _id, _type, ...fields })
  return transaction.patch(_id, patch => patch.ifRevisionId(previous._rev).set(fields))
}

export async function collectEvent(client, event, now = new Date()) {
  const { dailyId, visitId } = idsFor(event, now)
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const [daily, visit] = await client.getDocuments([dailyId, visitId])
    const next = nextDocuments(event, daily, visit, now)
    if (next.status !== 'counted') return next.status
    let transaction = writeDocument(client.transaction(), daily, next.daily)
    transaction = writeDocument(transaction, visit, next.visit)
    try {
      await transaction.commit({ visibility: 'sync' })
      return 'counted'
    } catch (error) {
      if (error.statusCode !== 409 || attempt === 3) throw error
      // Relecture après conflit : ni double comptage ni écrasement concurrent.
    }
  }
}
