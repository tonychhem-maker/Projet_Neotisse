// Nouvelle demande : Google Analytics s'ajoute à l'outil Neotisse.
export const CONSENT_KEY = 'neotisse-audience-consent-v3'
export const CONSENT_DURATION = 180 * 24 * 60 * 60 * 1000

export function parseConsent(raw, now = Date.now()) {
  try {
    const record = JSON.parse(raw)
    if (!['accepted', 'refused'].includes(record?.choice)) return null
    if (!Number.isFinite(record.savedAt) || record.savedAt > now) return null
    if (now - record.savedAt >= CONSENT_DURATION) return null
    return record
  } catch {
    return null
  }
}

export function readConsent() {
  try {
    return parseConsent(window.localStorage.getItem(CONSENT_KEY))
  } catch {
    return null
  }
}

export function saveConsent(choice) {
  const record = { choice, savedAt: Date.now() }
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(record))
  } catch {
    // Stockage bloqué : le choix reste valable uniquement pour cette visite.
  }
  return record
}
