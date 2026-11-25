export function dateRange(days, now = new Date()) {
  const end = now.toISOString().slice(0, 10)
  const start = new Date(`${end}T00:00:00.000Z`)
  start.setUTCDate(start.getUTCDate() - days + 1)
  return { start: start.toISOString().slice(0, 10), end }
}

export function summarize(rows, start, end) {
  const byDate = new Map(rows.map(row => [row.day, row]))
  const totals = { views: 0, visits: 0, clicks: 0 }
  const pages = new Map(), sources = new Map(), events = new Map()
  const days = []
  const date = new Date(`${start}T00:00:00.000Z`)
  while (date.toISOString().slice(0, 10) <= end) {
    const day = date.toISOString().slice(0, 10)
    const row = byDate.get(day)
    days.push({ day, views: row?.views ?? 0, visits: row?.visits ?? 0 })
    if (row) {
      totals.views += row.views || 0
      totals.visits += row.visits || 0
      for (const item of row.pages || []) pages.set(item.path, (pages.get(item.path) || 0) + item.count)
      for (const item of row.sources || []) sources.set(item.source, (sources.get(item.source) || 0) + item.count)
      for (const item of row.events || []) {
        events.set(item.kind, (events.get(item.kind) || 0) + item.count)
        totals.clicks += item.count
      }
    }
    date.setUTCDate(date.getUTCDate() + 1)
  }
  const rank = map => [...map].sort((a, b) => b[1] - a[1])
  return { totals, days, pages: rank(pages), sources: rank(sources), events: rank(events) }
}
