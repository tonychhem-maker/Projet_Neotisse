// Vérification réelle avec la session CLI Sanity, sans afficher son jeton.
// sanity exec scripts/verify-analytics.mjs --with-user-token
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { getCliClient } from 'sanity/cli'
import { collectEvent, idsFor } from '../../frontend/server/analytics.js'

const client = getCliClient({ apiVersion: '2025-02-19' }).withConfig({ useCdn: false, perspective: 'raw' })
// Date hors fenêtre de collecte : aucun compteur réel modifié.
const date = new Date('2001-01-01T12:00:00Z')
const sample = { id: randomUUID(), sessionId: randomUUID(), kind: 'pageview', path: '/', source: 'direct' }
const { dailyId, visitId } = idsFor(sample, date)
const existing = await client.getDocument(dailyId)
assert.equal(existing, undefined, 'Le document de test existe déjà : arrêt sans mutation.')
let created = false
try {
  assert.equal(await collectEvent(client, sample, date), 'counted')
  created = true
  assert.equal(await collectEvent(client, sample, date), 'duplicate')
  await Promise.all([
    collectEvent(client, { ...sample, id: randomUUID(), path: '/contact' }, date),
    collectEvent(client, { ...sample, id: randomUUID(), kind: 'contact_click' }, date),
  ])
  const doc = await client.getDocument(dailyId)
  assert.equal(doc.views, 2)
  assert.equal(doc.visits, 1)
  assert.equal(doc.events[0].count, 1)
  const anonymous = client.withConfig({ token: undefined })
  const publicDocs = await anonymous.fetch('*[_id in $ids]', { ids: [dailyId, visitId] })
  assert.deepEqual(publicDocs, [], 'Les statistiques ne doivent pas être lisibles anonymement.')
  console.log('OK : écritures concurrentes, déduplication, lecture authentifiée et invisibilité publique.')
} finally {
  if (created) {
    await client.transaction().delete(dailyId).delete(visitId).commit({ visibility: 'sync' })
    console.log('Documents de test supprimés.')
  }
}
