// GTM ne doit jamais être chargé avant un accord explicite pour les statistiques.
const CONTAINER_ID = 'GTM-5JC3FM5R'
const MEASUREMENT_ID = 'G-4RSN12HQ8K'
const ACTIONS = new Set(['contact_click', 'contact_submit', 'testimonial_open', 'testimonial_submit', 'workshop_open', 'article_open'])
let started = false

function gtag() {
  window.dataLayer.push(arguments)
}

// Ne jamais transmettre de paramètres d'URL, fragment ou URL référente brute.
export function googlePageLocation(pathname, origin) {
  const path = typeof pathname === 'string' ? pathname.split(/[?#]/)[0] : '/'
  const safePath = /^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*\/)*[a-z0-9-]*$/.test(path) ? path : '/'
  return `${origin}${safePath}`
}

export function startGoogleAnalytics(pathname) {
  if (started) return
  started = true
  window.dataLayer = window.dataLayer || []
  // Les commandes précèdent le chargement du conteneur et sa balise GA4.
  gtag('consent', 'default', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  })
  gtag('set', {
    page_location: googlePageLocation(pathname, window.location.origin),
    page_referrer: '',
    page_title: 'Neotisse',
    url_passthrough: false,
  })
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })
  const script = document.createElement('script')
  script.async = true
  script.referrerPolicy = 'no-referrer'
  script.src = `https://www.googletagmanager.com/gtm.js?id=${CONTAINER_ID}`
  // Enregistrer la page initiale avant les interactions, même si le script
  // réseau est encore en cours de chargement.
  trackGooglePage(pathname)
  document.head.appendChild(script)
}

export function trackGooglePage(pathname) {
  if (!started) return
  const page_location = googlePageLocation(pathname, window.location.origin)
  gtag('set', { page_location, page_referrer: '', page_title: 'Neotisse' })
  gtag('event', 'page_view', { send_to: MEASUREMENT_ID, page_location, page_referrer: '', page_title: 'Neotisse' })
}

// Liste fermée : aucun contenu de formulaire ni attribut issu du clic.
export function trackGoogleAction(kind, pathname) {
  if (!started || !ACTIONS.has(kind)) return
  const page_location = googlePageLocation(pathname, window.location.origin)
  gtag('event', kind, { send_to: MEASUREMENT_ID, page_location, page_referrer: '', page_title: 'Neotisse' })
}

// GTM ne peut pas être complètement déchargé : désactivation immédiate puis
// rechargement sans conteneur lors d'un retrait, d'une expiration ou d'une
// modification dans un autre onglet. Ne provoque aucune requête de consentement.
export function stopGoogleAnalytics() {
  if (!started) return false
  window[`ga-disable-${MEASUREMENT_ID}`] = true
  started = false
  return true
}
