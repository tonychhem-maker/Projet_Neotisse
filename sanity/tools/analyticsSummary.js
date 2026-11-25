// Traduction des agrégats quotidiens en KPI du plan de taggage.
//
// Tout est calculé en UTC, comme la collecte. Les ratios sont arrondis au
// dixième pour rester lisibles. Aucune donnée personnelle n'entre ici : les
// KPI ne manipulent que des compteurs.
import { CLICKS } from '../../frontend/server/analytics.js'

export const PERIOD = 30

/** Objectifs par défaut ; le Studio les remplace par le document « Objectifs statistiques ». */
export const DEFAULT_TARGETS = {
  quoteLeads: { low: 3, high: 6 },
  googleShare: { low: 25, high: 40 },
  testimonials: { low: 2, high: 4 },
}

export const STATUS = {
  low: { label: 'À améliorer', advice: 'Sous le seuil négatif : retravailler le contenu et le parcours.' },
  ok: { label: 'Dans la cible', advice: 'Entre les deux seuils : garder le cap et suivre la tendance.' },
  high: { label: 'Point fort', advice: 'Au-dessus du seuil positif : ne pas changer ce qui fonctionne.' },
  none: { label: 'Repère à définir', advice: 'Aucun seuil défini pour ce KPI.' },
}

const tenth = value => Math.round(value * 10) / 10
const ratio = (part, whole) => (whole ? tenth((part / whole) * 100) : 0)

export const shiftDay = (date, days) =>
  new Date(Date.parse(`${date}T00:00:00Z`) + days * 86400000).toISOString().slice(0, 10)

export function dateRange(days, now = new Date()) {
  const end = now.toISOString().slice(0, 10)
  return { start: shiftDay(end, 1 - days), end }
}

/** Même durée, juste avant la période affichée. */
export function previousRange(range) {
  const days = Math.round((Date.parse(`${range.end}T00:00:00Z`) - Date.parse(`${range.start}T00:00:00Z`)) / 86400000) + 1
  return { start: shiftDay(range.start, -days), end: shiftDay(range.start, -1) }
}

// Somme des agrégats d'une liste de journées : totaux, pages, sources, actions.
function totalsOf(rows) {
  const totals = { views: 0, visits: 0, engagedVisits: 0, clicks: 0 }
  const pages = new Map(), sources = new Map(), events = new Map()
  for (const row of rows) {
    totals.views += row.views || 0
    totals.visits += row.visits || 0
    totals.engagedVisits += row.engagedVisits || 0
    for (const item of row.pages || []) pages.set(item.path, (pages.get(item.path) || 0) + item.count)
    for (const item of row.sources || []) sources.set(item.source, (sources.get(item.source) || 0) + item.count)
    for (const item of row.events || []) {
      events.set(item.kind, (events.get(item.kind) || 0) + item.count)
      if (CLICKS.has(item.kind)) totals.clicks += item.count
    }
  }
  const rank = map => [...map].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  return { totals, pages: rank(pages), sources: rank(sources), events: rank(events) }
}

/** Séries quotidiennes complètes (jours sans trafic inclus) entre start et end. */
export function summarize(rows, start, end) {
  const byDate = new Map(rows.map(row => [row.day, row]))
  const days = []
  for (let date = start; date <= end; date = shiftDay(date, 1)) {
    const row = byDate.get(date)
    days.push({ day: date, views: row?.views ?? 0, visits: row?.visits ?? 0, engagedVisits: row?.engagedVisits ?? 0 })
  }
  return { ...totalsOf(rows), days }
}

/** Index jour → nombre, à partir de documents datés (messages du livre d'or). */
export function countByDay(documents = []) {
  const counts = new Map()
  for (const doc of documents) {
    const date = (doc.submittedAt || doc.publishedAt || doc._createdAt || '').slice(0, 10)
    if (date) counts.set(date, (counts.get(date) || 0) + 1)
  }
  return counts
}

function countIn(counts, range) {
  let total = 0
  for (let date = range.start; date <= range.end; date = shiftDay(date, 1)) total += counts.get(date) || 0
  return total
}

export function statusOf(value, target) {
  if (!target || value === null) return 'none'
  if (value < target.low) return 'low'
  if (value > target.high) return 'high'
  return 'ok'
}

// Un écart sans historique n'est pas une évolution : il n'est pas chiffré.
const evolution = (value, previousValue) => ({
  previousValue,
  delta: previousValue === null || previousValue === undefined ? null : tenth(value - previousValue),
})

const eventOf = (totals, kind) => totals.events.find(([name]) => name === kind)?.[1] ?? 0
const googleShare = totals => ratio(totals.sources.find(([name]) => name === 'google')?.[1] ?? 0, totals.totals.visits)
const actualiteViews = totals => totals.pages
  .filter(([path]) => path.startsWith('/actualites/'))
  .reduce((sum, [, count]) => sum + count, 0)

/**
 * Les trois KPI du plan de taggage, comparés à la durée équivalente juste avant.
 *
 * - Demandes de devis : messages envoyés depuis le formulaire de contact.
 * - Référencement : part des visites venues de Google, et vues des actualités.
 * - Avis reçus : messages du livre d'or reçus sur la période.
 */
export function kpis(rows, range, { targets = DEFAULT_TARGETS, testimonials = new Map(), hasHistory = true } = {}) {
  const before = previousRange(range)
  const now = totalsOf(rows.filter(row => row.day >= range.start && row.day <= range.end))
  const then = totalsOf(rows.filter(row => row.day >= before.start && row.day <= before.end))
  // Sans historique collecté, la période précédente vaut « inconnue », pas zéro.
  const before0 = value => (hasHistory ? value : null)

  const items = [
    {
      id: 'quoteLeads',
      label: 'Demandes de devis',
      value: eventOf(now, 'contact_submit'),
      unit: 'messages',
      hint: 'Messages envoyés depuis le formulaire de contact. Leur contenu n’est jamais collecté.',
      target: targets.quoteLeads,
      previousValue: before0(eventOf(then, 'contact_submit')),
    },
    {
      id: 'seo',
      label: 'Référencement',
      value: googleShare(now),
      unit: '% des visites via Google',
      hint: 'Part des visites venant de Google, complétée par les vues des actualités. Sans Search Console, la position réelle dans Google n’est pas mesurable.',
      target: targets.googleShare,
      previousValue: before0(googleShare(then)),
      detail: {
        label: 'Vues des actualités',
        value: actualiteViews(now),
        previousValue: before0(actualiteViews(then)),
      },
    },
    {
      id: 'testimonials',
      label: 'Avis reçus',
      value: countIn(testimonials, range),
      unit: 'messages',
      hint: 'Messages du livre d’or reçus sur la période, avant modération.',
      target: targets.testimonials,
      previousValue: before0(countIn(testimonials, before)),
    },
  ]

  return {
    kpis: items.map(item => ({
      ...item,
      ...evolution(item.value, item.previousValue),
      status: statusOf(item.value, item.target),
      detail: item.detail && { ...item.detail, ...evolution(item.detail.value, item.detail.previousValue) },
    })),
    period: range,
    before,
  }
}

/** Totaux de la période et comparatif, plus les tableaux détaillés. */
export function report(rows, range, extra = {}) {
  const before = previousRange(range)
  const current = summarize(rows.filter(row => row.day >= range.start && row.day <= range.end), range.start, range.end)
  const previousTotals = totalsOf(rows.filter(row => row.day >= before.start && row.day <= before.end)).totals
  return {
    ...current,
    previousTotals,
    kpis: kpis(rows, range, extra).kpis,
    conversion: {
      current: ratio(current.totals.engagedVisits, current.totals.visits),
      previous: ratio(previousTotals.engagedVisits, previousTotals.visits),
    },
  }
}
