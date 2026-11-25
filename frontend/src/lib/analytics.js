import { readConsent } from './audienceConsent'

const SESSION_KEY = 'neotisse-analytics-session-v1'
const SESSION_IDLE = 30 * 60 * 1000
let memorySession
let enabled = false
let aborter = new AbortController()
let queue = Promise.resolve()
let generation = 0

export function setAnalyticsConsent(allowed) {
  enabled = allowed && import.meta.env.VITE_ANALYTICS_ENABLED === 'true'
  if (!enabled) {
    generation += 1
    aborter.abort()
    aborter = new AbortController()
    memorySession = undefined
    try { sessionStorage.removeItem(SESSION_KEY) } catch { /* stockage indisponible */ }
  }
}

function session() {
  const now = Date.now()
  try { memorySession = JSON.parse(sessionStorage.getItem(SESSION_KEY)) || memorySession } catch { /* repli mémoire */ }
  if (!memorySession || now - memorySession.lastAt >= SESSION_IDLE || memorySession.day !== new Date(now).toISOString().slice(0, 10)) {
    memorySession = { id: crypto.randomUUID(), lastAt: now, day: new Date(now).toISOString().slice(0, 10), source: sourceOf(document.referrer) }
  }
  memorySession.lastAt = now
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(memorySession)) } catch { /* repli mémoire */ }
  return memorySession
}

function sourceOf(referrer) {
  if (!referrer) return 'direct'
  try {
    const host = new URL(referrer).hostname.toLowerCase()
    if (host === location.hostname) return 'direct'
    if (/(^|\.)google\.[a-z.]+$/.test(host)) return 'google'
    for (const name of ['bing', 'facebook', 'instagram', 'linkedin']) {
      if (host === `${name}.com` || host.endsWith(`.${name}.com`)) return name
    }
    return 'other'
  } catch { return 'direct' }
}

export function trackAudience(kind, path = location.pathname) {
  if (!enabled || readConsent()?.choice !== 'accepted') return
  const visit = session()
  const payload = { id: crypto.randomUUID(), sessionId: visit.id, consent: true, kind, path: path.split(/[?#]/)[0], source: visit.source }
  const currentGeneration = generation
  queue = queue.then(async () => {
    if (!enabled || currentGeneration !== generation || readConsent()?.choice !== 'accepted') return
    const signal = aborter.signal
    for (let attempt = 0; attempt < 2; attempt += 1) {
      if (signal.aborted) return
      try {
        const res = await fetch('/api/analytics', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal, credentials: 'omit' })
        if (res.status < 500) return
      } catch { if (signal.aborted) return }
    }
  }).catch(() => {})
}

export function trackAudienceClick(event) {
  const target = event.target instanceof Element ? event.target : null
  const link = target?.closest('a[href]')
  if (link) {
    try {
      const url = new URL(link.href, location.origin)
      if (url.origin !== location.origin) return
      if (url.pathname === '/contact') trackAudience('contact_click')
      else if (url.pathname === '/livre-d-or/laisser-un-mot') trackAudience('testimonial_open')
      else if (url.pathname.startsWith('/actualites/')) trackAudience('article_open')
    } catch { /* lien non HTTP */ }
  }
  const button = target?.closest('button[aria-controls^="format-panel-"]')
  if (button?.getAttribute('aria-expanded') === 'false') trackAudience('workshop_open')
}
