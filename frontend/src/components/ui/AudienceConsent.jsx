import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CONSENT_DURATION, CONSENT_KEY, readConsent, saveConsent } from '../../lib/audienceConsent'
import './AudienceConsent.css'

const scriptUrl = import.meta.env.VITE_UMAMI_SCRIPT_URL?.trim()
const websiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID?.trim()
let trackerPromise
let trackingAllowed = false

function loadTracker() {
  if (!scriptUrl || !websiteId) return Promise.resolve(null)
  if (trackerPromise) return trackerPromise
  trackerPromise = new Promise((resolve) => {
    let url
    try {
      url = new URL(scriptUrl)
      if (url.protocol !== 'https:') throw new Error('HTTPS required')
    } catch {
      resolve(null)
      return
    }
    // Aucun suivi automatique ni écouteur de clic : seules les pages sont envoyées.
    window.neotisseAudienceBeforeSend = (type, payload) => trackingAllowed ? payload : false
    const script = document.createElement('script')
    script.id = 'neotisse-umami'
    script.src = url.href
    script.async = true
    script.dataset.websiteId = websiteId
    script.dataset.autoTrack = 'false'
    script.dataset.beforeSend = 'neotisseAudienceBeforeSend'
    script.onload = () => resolve(window.umami ?? null)
    script.onerror = () => {
      script.remove()
      trackerPromise = undefined
      resolve(null)
    }
    document.head.appendChild(script)
  })
  return trackerPromise
}

export default function AudienceConsent() {
  const [record, setRecord] = useState(readConsent)
  const [editing, setEditing] = useState(false)
  const { pathname } = useLocation()
  const returnFocus = useRef(null)
  const firstAction = useRef(null)
  const accepted = record?.choice === 'accepted'
  const visible = !record || editing

  useEffect(() => {
    const open = () => {
      returnFocus.current = document.activeElement
      setEditing(true)
    }
    const sync = (event) => {
      if (event.key !== CONSENT_KEY && event.key !== null) return
      const next = readConsent()
      trackingAllowed = next?.choice === 'accepted'
      setRecord(next)
    }
    window.addEventListener('neotisse:privacy-settings', open)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('neotisse:privacy-settings', open)
      window.removeEventListener('storage', sync)
    }
  }, [])

  useEffect(() => {
    if (editing) firstAction.current?.focus()
  }, [editing])

  useEffect(() => {
    if (!record) return undefined
    let timer
    const checkExpiry = () => {
      const remaining = record.savedAt + CONSENT_DURATION - Date.now()
      if (remaining <= 0) {
        trackingAllowed = false
        setRecord(null)
      } else {
        timer = window.setTimeout(checkExpiry, Math.min(remaining, 86400000))
      }
    }
    checkExpiry()
    return () => window.clearTimeout(timer)
  }, [record])

  useEffect(() => {
    trackingAllowed = accepted
    if (!accepted) return undefined
    let cancelled = false
    loadTracker().then((tracker) => {
      if (cancelled || !trackingAllowed || !tracker) return
      // Ne pas transmettre les paramètres de recherche, fragments ou champs de formulaire.
      tracker.track((payload) => ({ ...payload, url: pathname, referrer: '' }))?.catch?.(() => {})
    })
    return () => {
      cancelled = true
      trackingAllowed = false
    }
  }, [accepted, pathname])

  function choose(choice) {
    trackingAllowed = choice === 'accepted'
    setRecord(saveConsent(choice))
    setEditing(false)
    returnFocus.current?.focus()
  }

  if (!visible) return null
  return (
    <section className="audience-consent" aria-labelledby="audience-consent-title" aria-describedby="audience-consent-text">
      <div className="audience-consent__copy">
        <h2 id="audience-consent-title">Votre choix pour les statistiques</h2>
        <p id="audience-consent-text">
          Avec votre accord, nous utilisons Umami pour comprendre la fréquentation du site
          et améliorer votre visite. Vous pouvez refuser et continuer à naviguer normalement.
          Votre choix est mémorisé pendant 180 jours et reste modifiable dans le pied de page.
        </p>
        <Link to="/politique-de-cookies">En savoir plus sur les cookies et les statistiques</Link>
      </div>
      <div className="audience-consent__actions">
        <button ref={firstAction} type="button" onClick={() => choose('refused')}>Refuser</button>
        <button type="button" onClick={() => choose('accepted')}>Accepter</button>
        {editing && <button type="button" onClick={() => { setEditing(false); returnFocus.current?.focus() }}>Fermer</button>}
      </div>
    </section>
  )
}
