import test from 'node:test'
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { DAILY_LIMIT, SESSION_LIMIT, validateEvent, idsFor, nextDocuments, collectEvent } from './analytics.js'
import { dateRange, summarize } from '../../sanity/tools/analyticsSummary.js'

const now = new Date('2026-11-25T12:00:00Z')
const event = (overrides = {}) => ({ consent: true, id: randomUUID(), sessionId: randomUUID(), kind: 'pageview', path: '/', source: 'direct', ...overrides })

test('validation stricte : accord, UUID, routes, actions et suppression des paramètres', () => {
  for (const body of [null, [], event({ consent: false }), event({ sessionId: 'email@test.fr' }), event({ kind: 'form_content' }), event({ path: '/admin' }), event({ path: 'https://external.test/' })]) assert.equal(validateEvent(body), null)
  const valid = validateEvent(event({ path: '/contact?email=secret#nom', source: 'https://private.test/secret' }))
  assert.equal(valid.path, '/contact')
  assert.equal(valid.source, 'direct')
})

test('une visite, plusieurs pages ; même événement dédupliqué ; nouvelle visite comptée', () => {
  const first = event()
  const one = nextDocuments(first, null, null, now)
  assert.equal(one.daily.views, 1)
  assert.equal(one.daily.visits, 1)
  assert.equal(nextDocuments(first, one.daily, one.visit, now).status, 'duplicate')
  const two = nextDocuments(event({ sessionId: first.sessionId, path: '/contact' }), one.daily, one.visit, now)
  assert.equal(two.daily.views, 2)
  assert.equal(two.daily.visits, 1)
  const three = nextDocuments(event({ kind: 'contact_click' }), two.daily, null, now)
  assert.equal(three.daily.views, 2)
  assert.equal(three.daily.visits, 2)
  assert.equal(three.daily.events[0].count, 1)
})

test('documents privés, identifiant renouvelé chaque jour, pas de session brute stockée', () => {
  const sample = event()
  const first = idsFor(sample, now)
  assert.match(first.visitId, /^analytics\.visit\./)
  assert.ok(!first.visitId.includes(sample.sessionId))
  assert.notEqual(first.visitId, idsFor(sample, new Date('2026-11-26')).visitId)
  assert.ok(!JSON.stringify(nextDocuments(sample, null, null, now)).includes(sample.sessionId))
})

test('plafonds bornent écritures et nombre de chemins', () => {
  assert.equal(nextDocuments(event(), { received: DAILY_LIMIT }, null, now).status, 'limited')
  assert.equal(nextDocuments(event(), null, { eventIds: Array(SESSION_LIMIT).fill('x') }, now).status, 'limited')
})

test('une transaction concurrente en conflit est relue avant réessai', async () => {
  const first = event()
  const existing = nextDocuments(event(), null, null, now).daily
  existing._rev = 'concurrent'
  let reads = 0, commits = 0, patchedViews
  const client = {
    getDocuments: async () => (++reads === 1 ? [null, null] : [existing, null]),
    transaction() {
      const tx = {
        create() { return tx },
        patch(id, fn) { fn({ ifRevisionId() { return { set(fields) { patchedViews = fields.views } } } }); return tx },
        async commit() { if (++commits === 1) throw { statusCode: 409 } },
      }
      return tx
    },
  }
  assert.equal(await collectEvent(client, first, now), 'counted')
  assert.equal(reads, 2)
  assert.equal(patchedViews, 2)
})

test('tableau de bord : UTC, jours sans trafic, classement et totaux', () => {
  const range = dateRange(7, now)
  assert.deepEqual(range, { start: '2026-11-19', end: '2026-11-25' })
  const report = summarize([{ day: '2026-11-25', views: 3, visits: 2, pages: [{ path: '/', count: 3 }], events: [{ kind: 'contact_click', count: 1 }] }], range.start, range.end)
  assert.equal(report.days.length, 7)
  assert.equal(report.days[0].views, 0)
  assert.deepEqual(report.totals, { views: 3, visits: 2, clicks: 1 })
})
