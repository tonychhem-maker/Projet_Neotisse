// Vérification réelle avec la session CLI Sanity, sans afficher son jeton.
// sanity exec scripts/verify-analytics.mjs --with-user-token
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { getCliClient } from 'sanity/cli'
import { collectEvent, idsFor, validateEvent } from '../../frontend/server/analytics.js'

const client = getCliClient({ apiVersion: '2025-02-19' }).withConfig({ useCdn: false, perspective: 'raw' })
// Date hors fenêtre de collecte : aucun compteur réel modifié.
const date = new Date('2001-01-01T12:00:00Z')
const sessionId = randomUUID()
const base = { consent: true, sessionId, path: '/', source: 'google' }
const send = (kind, path = '/') => {
  const body = validateEvent({ ...base, id: randomUUID(), kind, path })
  assert.ok(body, `événement refusé : ${kind}`)
  return body
}
const dailyId = idsFor({ sessionId }, date).dailyId
const visitId = idsFor({ sessionId }, date).visitId
assert.equal(await client.getDocument(dailyId), undefined, 'Le document de test existe déjà : arrêt sans mutation.')
let created = false
try {
  const first = send('pageview')
  assert.equal(await collectEvent(client, first, date), 'counted')
  created = true
  assert.equal(await collectEvent(client, first, date), 'duplicate')
  await collectEvent(client, send('contact_click', '/contact'), date)
  await collectEvent(client, send('contact_submit', '/contact'), date)
  await collectEvent(client, send('testimonial_submit', '/livre-d-or/laisser-un-mot'), date)
  await Promise.all([
    collectEvent(client, send('pageview', '/contact'), date),
    collectEvent(client, send('pageview', '/actualites/festival-archeologie-experimentale-occitanie'), date),
    collectEvent(client, send('testimonial_open', '/livre-d-or/laisser-un-mot'), date),
  ])
  const doc = await client.getDocument(dailyId)
  assert.equal(doc.views, 3, 'trois pages vues')
  assert.equal(doc.visits, 1, 'une seule visite')
  assert.equal(doc.engagedVisits, 1, 'une visite engagée, comptée une seule fois')
  const count = kind => doc.events.find(event => event.kind === kind)?.count ?? 0
  assert.equal(count('contact_submit'), 1)
  assert.equal(count('contact_click'), 1)
  assert.equal(count('testimonial_submit'), 1)
  const anonymous = client.withConfig({ token: undefined })
  assert.deepEqual(await anonymous.fetch('*[_id in $ids]', { ids: [dailyId, visitId] }), [], 'Les statistiques ne doivent pas être lisibles anonymement.')
  console.log('OK : écritures concurrentes, déduplication, conversions, visites engagées et invisibilité publique.')
} finally {
  if (created) {
    await client.transaction().delete(dailyId).delete(visitId).commit({ visibility: 'sync' })
    console.log('Documents de test supprimés.')
  }
}
