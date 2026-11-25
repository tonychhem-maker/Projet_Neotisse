import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CONSENT_DURATION, CONSENT_KEY, readConsent, saveConsent } from '../../lib/audienceConsent'
import { setAnalyticsConsent, trackAudience, trackAudienceClick } from '../../lib/analytics'
import { startGoogleAnalytics, stopGoogleAnalytics, trackGooglePage } from '../../lib/googleAnalytics'
import './AudienceConsent.css'

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
      setAnalyticsConsent(next?.choice === 'accepted')
      if (next?.choice !== 'accepted' && stopGoogleAnalytics()) window.location.reload()
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
        setAnalyticsConsent(false)
        if (stopGoogleAnalytics()) window.location.reload()
        setRecord(null)
      } else {
        timer = window.setTimeout(checkExpiry, Math.min(remaining, 86400000))
      }
    }
    checkExpiry()
    return () => window.clearTimeout(timer)
  }, [record])

  useEffect(() => {
    setAnalyticsConsent(accepted)
    if (!accepted) return undefined
    document.addEventListener('click', trackAudienceClick, true)
    return () => {
      document.removeEventListener('click', trackAudienceClick, true)
      setAnalyticsConsent(false)
    }
  }, [accepted])

  useEffect(() => {
    if (!accepted) return undefined
    // Différé d'une frame : le montage de contrôle React StrictMode est annulé.
    const frame = requestAnimationFrame(() => {
      startGoogleAnalytics(pathname)
      trackGooglePage(pathname)
      trackAudience('pageview', pathname)
    })
    return () => cancelAnimationFrame(frame)
  }, [accepted, pathname])

  function choose(choice) {
    setAnalyticsConsent(choice === 'accepted')
    setRecord(saveConsent(choice))
    if (choice !== 'accepted' && stopGoogleAnalytics()) window.location.reload()
    setEditing(false)
    returnFocus.current?.focus()
  }

  if (!visible) return null
  return (
    <section className="audience-consent" aria-labelledby="audience-consent-title" aria-describedby="audience-consent-text">
      <div className="audience-consent__copy">
        <h2 id="audience-consent-title">Votre choix pour les statistiques</h2>
        <p id="audience-consent-text">
          Avec votre accord, notre outil de statistiques et Google Analytics mesurent les pages
          consultées et certains clics pour améliorer le site. Vous pouvez refuser et continuer à naviguer normalement.
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
