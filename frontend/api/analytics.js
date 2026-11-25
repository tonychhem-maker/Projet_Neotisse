import { createClient } from '@sanity/client'
import { collectEvent, validateEvent } from '../server/analytics.js'

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Méthode non autorisée' })
  }
  if (process.env.ANALYTICS_ENABLED !== 'true') return res.status(204).end()
  const origins = (process.env.ANALYTICS_ALLOWED_ORIGINS || 'https://neotisse.vercel.app').split(',').map(s => s.trim())
  if (!origins.includes(req.headers.origin)) return res.status(403).json({ error: 'Origine refusée' })
  if (!req.headers['content-type']?.startsWith('application/json')) return res.status(415).end()
  if (Number(req.headers['content-length']) > 2048) return res.status(413).end()
  let body
  try {
    const raw = typeof req.body === 'string' ? req.body : JSON.stringify(req.body)
    if (!raw || Buffer.byteLength(raw) > 2048) return res.status(413).end()
    body = JSON.parse(raw)
  } catch { return res.status(400).end() }
  const event = validateEvent(body)
  if (!event) return res.status(422).json({ error: 'Mesure invalide' })
  const token = process.env.SANITY_ANALYTICS_WRITE_TOKEN || process.env.SANITY_WRITE_TOKEN
  if (!token) return res.status(503).json({ error: 'Statistiques indisponibles' })
  const client = createClient({ projectId: process.env.SANITY_PROJECT_ID || 'k7jmb6gr', dataset: process.env.SANITY_DATASET || 'production', apiVersion: '2025-02-19', useCdn: false, token, timeout: 8000, maxRetries: 0 })
  try {
    const status = await collectEvent(client, event)
    if (status === 'limited') return res.status(429).json({ error: 'Limite de collecte atteinte' })
    return res.status(204).end()
  } catch (error) {
    console.error('[analytics] storage failed', error.statusCode ?? 'unknown')
    return res.status(503).json({ error: 'Statistiques indisponibles' })
  }
}
