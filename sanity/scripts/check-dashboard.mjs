// Simulation de la lecture du tableau de bord avec la session CLI.
// sanity exec scripts/check-dashboard.mjs --with-user-token
import { getCliClient } from 'sanity/cli'
import { countByDay, dateRange, previousRange, report } from '../tools/analyticsSummary.js'

const client = getCliClient({ apiVersion: '2025-02-19' }).withConfig({ useCdn: false, perspective: 'raw' })
const range = dateRange(30)
const before = previousRange(range)
const rows = await client.fetch(
  '*[_type == "analyticsDaily" && _id in path("analytics.daily.**") && day >= $start && day <= $end] | order(day asc) { day, views, visits, engagedVisits, pages, sources, events }',
  { start: before.start, end: range.end },
)
const testimonials = countByDay(await client.fetch('*[_type == "testimonial" && _id in path("testimonial-**") && coalesce(submittedAt, publishedAt, _createdAt) >= $start] { submittedAt, publishedAt, _createdAt }', { start: before.start }))
const targets = await client.fetch('*[_id == "analyticsTargets"][0]{ quoteLeads, googleShare, testimonials }')
const hasHistory = before.end >= '2026-11-25'
const data = report(rows, range, { targets, testimonials, hasHistory })
console.log(JSON.stringify({
  range, before, rowsRead: rows.length,
  totals: data.totals,
  previousTotals: data.previousTotals,
  kpis: data.kpis.map(({ label, value, unit, previousValue, delta, status, detail }) => ({ label, value, unit, previousValue, delta, status, detail })),
  conversion: data.conversion,
}, null, 2))
