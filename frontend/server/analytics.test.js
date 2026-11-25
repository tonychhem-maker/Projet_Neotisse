import test from 'node:test'
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { DAILY_LIMIT, SESSION_LIMIT, validateEvent, idsFor, nextDocuments, collectEvent } from './analytics.js'
import {
  DEFAULT_TARGETS,
  countByDay,
  dateRange,
  kpis,
  previousRange,
  report,
  summarize,
} from '../../sanity/tools/analyticsSummary.js'

const now = new Date('2026-11-25T12:00:00Z')
const event = (overrides = {}) => ({ consent: true, id: randomUUID(), sessionId: randomUUID(), kind: 'pageview', path: '/', source: 'direct', ...overrides })

test('validation stricte : accord, UUID, routes, actions et suppression des paramètres', () => {
  for (const body of [null, [], event({ consent: false }), event({ sessionId: 'email@test.fr' }), event({ kind: 'form_content' }), event({ path: '/admin' }), event({ path: 'https://external.test/' })]) assert.equal(validateEvent(body), null)
  const valid = validateEvent(event({ path: '/contact?email=secret#nom', source: 'https://private.test/secret' }))
  assert.equal(valid.path, '/contact')
  assert.equal(valid.source, 'direct')
})

test('les conversions sont acceptées, une page vue ne l’est pas comme action', () => {
  for (const kind of ['contact_submit', 'testimonial_submit', 'testimonial_open']) {
    assert.equal(validateEvent(event({ kind })).kind, kind)
  }
  assert.equal(validateEvent(event({ kind: 'pageview' })).kind, 'pageview')
})

test('une visite, plusieurs pages ; même événement dédupliqué ; nouvelle visite comptée', () => {
  const first = event()
  const one = nextDocuments(first, null, null, now)
  assert.equal(one.daily.views, 1)
  assert.equal(one.daily.visits, 1)
  assert.equal(one.daily.engagedVisits, 0)
  assert.equal(nextDocuments(first, one.daily, one.visit, now).status, 'duplicate')
  const two = nextDocuments(event({ sessionId: first.sessionId, path: '/contact' }), one.daily, one.visit, now)
  assert.equal(two.daily.views, 2)
  assert.equal(two.daily.visits, 1)
  const three = nextDocuments(event({ kind: 'contact_click' }), two.daily, null, now)
  assert.equal(three.daily.views, 2)
  assert.equal(three.daily.visits, 2)
  assert.equal(three.daily.events[0].count, 1)
  // Un clic d'intention ne rend pas la visite « engagée ».
  assert.equal(three.daily.engagedVisits, 0)
})

test('une visite n’est comptée comme engagée qu’une fois, au premier message envoyé', () => {
  const sessionId = randomUUID()
  const page = nextDocuments(event({ sessionId }), null, null, now)
  const click = nextDocuments(event({ sessionId, kind: 'contact_click' }), page.daily, page.visit, now)
  const sent = nextDocuments(event({ sessionId, kind: 'contact_submit' }), click.daily, click.visit, now)
  const again = nextDocuments(event({ sessionId, kind: 'testimonial_submit' }), sent.daily, sent.visit, now)
  assert.equal(click.daily.engagedVisits, 0)
  assert.equal(sent.daily.engagedVisits, 1)
  assert.equal(sent.visit.engaged, true)
  assert.equal(again.daily.engagedVisits, 1)
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
  const result = summarize([{ day: '2026-11-25', views: 3, visits: 2, pages: [{ path: '/', count: 3 }], events: [{ kind: 'contact_click', count: 1 }] }], range.start, range.end)
  assert.equal(result.days.length, 7)
  assert.equal(result.days[0].views, 0)
  assert.deepEqual(result.totals, { views: 3, visits: 2, engagedVisits: 0, clicks: 1 })
})

test('période précédente : même durée, juste avant', () => {
  assert.deepEqual(previousRange({ start: '2026-11-19', end: '2026-11-25' }), { start: '2026-11-12', end: '2026-11-18' })
  assert.deepEqual(previousRange({ start: '2026-11-01', end: '2026-11-30' }), { start: '2026-10-02', end: '2026-10-31' })
})

const rowsFor = () => [
  {
    day: '2026-10-20', views: 10, visits: 10, engagedVisits: 1,
    pages: [{ path: '/actualites/ancienne', count: 4 }],
    sources: [{ source: 'direct', count: 10 }],
    events: [{ kind: 'contact_submit', count: 1 }],
  },
  {
    day: '2026-11-24', views: 20, visits: 20, engagedVisits: 3,
    pages: [{ path: '/actualites/festival', count: 6 }, { path: '/', count: 14 }],
    sources: [{ source: 'google', count: 12 }, { source: 'direct', count: 8 }],
    events: [{ kind: 'contact_submit', count: 4 }, { kind: 'testimonial_submit', count: 2 }, { kind: 'contact_click', count: 5 }],
  },
]

test('KPI : valeurs, comparatif et statut selon les seuils', () => {
  const range = dateRange(30, now)
  const { kpis: list } = kpis(rowsFor(), range, { targets: DEFAULT_TARGETS, hasHistory: true })
  const [quotes, seo, avis] = list
  assert.equal(quotes.value, 4)
  assert.equal(quotes.previousValue, 1)
  assert.equal(quotes.delta, 3)
  assert.equal(quotes.status, 'ok') // entre 3 et 6
  assert.equal(seo.value, 60) // 12 visites Google sur 20
  assert.equal(seo.status, 'high') // au-dessus de 40 %
  assert.equal(seo.detail.value, 6)
  assert.equal(avis.value, 0) // aucun document de livre d'or fourni
})

test('KPI : les seuils changent le statut, et un objectif absent ne juge pas', () => {
  const range = dateRange(30, now)
  const strict = { ...DEFAULT_TARGETS, quoteLeads: { low: 5, high: 8 } }
  const { kpis: list } = kpis(rowsFor(), range, { targets: strict, hasHistory: true })
  assert.equal(list[0].status, 'low')
  const noTarget = kpis(rowsFor(), range, { targets: { quoteLeads: undefined, googleShare: undefined, testimonials: undefined }, hasHistory: true }).kpis
  for (const kpi of noTarget) assert.equal(kpi.status, 'none')
})

test('KPI : sans historique collecté, l’évolution reste inconnue au lieu d’un faux 0', () => {
  const range = dateRange(30, now)
  const { kpis: list } = kpis(rowsFor(), range, { hasHistory: false })
  for (const kpi of list) {
    assert.equal(kpi.previousValue, null)
    assert.equal(kpi.delta, null)
  }
})

test('avis du livre d’or : comptage par jour et sur la période', () => {
  const counts = countByDay([
    { submittedAt: '2026-11-24T09:00:00Z' },
    { publishedAt: '2026-11-24T18:00:00Z' },
    { submittedAt: '2026-10-01T10:00:00Z' },
    {},
  ])
  assert.equal(counts.get('2026-11-24'), 2)
  const range = dateRange(30, now)
  const { kpis: list } = kpis(rowsFor(), range, { testimonials: counts, hasHistory: true })
  assert.equal(list[2].value, 2)
  assert.equal(list[2].status, 'ok') // entre 2 et 4
})

test('rapport : conversion en pourcentage et comparatif de période', () => {
  const range = dateRange(30, now)
  const data = report(rowsFor(), range, { hasHistory: true })
  assert.equal(data.totals.visits, 20)
  assert.equal(data.previousTotals.visits, 10)
  assert.equal(data.conversion.current, 15) // 3 visites avec intention sur 20
  assert.equal(data.conversion.previous, 10) // 1 sur 10
  assert.equal(data.days.length, 30)
})
