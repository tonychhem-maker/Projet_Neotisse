import { createClient } from '@sanity/client'
import { timingSafeEqual } from 'node:crypto'
import { RETENTION_DAYS } from '../server/analytics.js'

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  const secret = process.env.CRON_SECRET
  const expected = Buffer.from(`Bearer ${secret ?? ''}`)
  const actual = Buffer.from(req.headers.authorization ?? '')
  if (!secret || expected.length !== actual.length || !timingSafeEqual(expected, actual)) return res.status(401).end()
  if (req.method !== 'GET') return res.status(405).end()
  const token = process.env.SANITY_ANALYTICS_WRITE_TOKEN || process.env.SANITY_WRITE_TOKEN
  if (!token) return res.status(503).end()
  const client = createClient({ projectId: process.env.SANITY_PROJECT_ID || 'k7jmb6gr', dataset: process.env.SANITY_DATASET || 'production', apiVersion: '2025-02-19', useCdn: false, token, timeout: 10000 })
  const cutoff = new Date(Date.now() - RETENTION_DAYS * 86400000).toISOString().slice(0, 10)
  const today = new Date().toISOString().slice(0, 10)
  try {
    // Lots bornés : on ne touche qu'aux documents techniques de notre outil.
    const ids = await client.fetch('*[_id in path("analytics.**") && ((_type == "analyticsDaily" && day <= $cutoff) || (_type == "analyticsVisit" && day < $today))][0...5000]._id', { cutoff, today })
    if (ids.length) {
      const tx = client.transaction()
      ids.forEach(id => tx.delete(id))
      await tx.commit()
    }
    return res.status(200).json({ deleted: ids.length, cutoff, moreMayRemain: ids.length === 5000 })
  } catch {
    return res.status(503).json({ error: 'Purge indisponible' })
  }
}
