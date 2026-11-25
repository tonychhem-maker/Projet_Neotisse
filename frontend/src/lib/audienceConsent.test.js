import test from 'node:test'
import assert from 'node:assert/strict'
import { CONSENT_DURATION, parseConsent } from './audienceConsent.js'

test('le choix est absent pour un stockage vide, invalide ou inconnu', () => {
  for (const raw of [null, '', '{', '{}', JSON.stringify({ choice: 'other', savedAt: 100 })]) {
    assert.equal(parseConsent(raw, 1000), null)
  }
})

test('accepter et refuser ont la même durée de validité', () => {
  for (const choice of ['accepted', 'refused']) {
    const record = { choice, savedAt: 1000 }
    assert.deepEqual(parseConsent(JSON.stringify(record), 2000), record)
    assert.equal(parseConsent(JSON.stringify(record), 1000 + CONSENT_DURATION), null)
    assert.equal(parseConsent(JSON.stringify(record), 999), null)
  }
})
