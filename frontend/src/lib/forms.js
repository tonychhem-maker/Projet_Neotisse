const CONTACT_ENDPOINT =
  import.meta.env.VITE_CONTACT_FORM_ENDPOINT ?? 'https://formspree.io/f/REMPLACER_PAR_VOTRE_ID'

const TESTIMONIAL_ENDPOINT =
  import.meta.env.VITE_TESTIMONIAL_FORM_ENDPOINT ?? CONTACT_ENDPOINT

// Fonction serverless qui crée le document `testimonial` dans Sanity
// (file « à modérer » du studio). Non renseignée : le livre d'or retombe
// sur Formspree (modération par e-mail).
const TESTIMONIAL_API = import.meta.env.VITE_TESTIMONIAL_API_ENDPOINT

export const isContactFormConfigured = !CONTACT_ENDPOINT.includes('REMPLACER_PAR_VOTRE_ID')

async function postJson(endpoint, payload) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`Envoi impossible (${response.status})`)
  }

  return response.json().catch(() => ({}))
}

// Formulaire de contact → Formspree (ou service équivalent).
// `endpoint` permet de surcharger l'URL depuis le back-office.
export function sendContactMessage(
  { firstName, lastName, email, organisation, message, consent, honeypot },
  endpoint,
) {
  return postJson(endpoint || CONTACT_ENDPOINT, {
    _subject: 'Nouveau message depuis neotisse.fr',
    Prenom: firstName,
    Nom: lastName,
    Email: email,
    Structure: organisation ?? '',
    Message: message ?? '',
    Consentement: consent ? 'Oui' : 'Non',
    _gotcha: honeypot ?? '',
  })
}

// Livre d'or. Deux canaux :
// 1. `VITE_TESTIMONIAL_API_ENDPOINT` renseigné → la fonction serverless crée
//    le document `testimonial` dans Sanity (status pending) : il apparaît
//    dans la file « à modérer » du studio, puis est publié depuis là.
// 2. Sinon → Formspree (e-mail) : la modération se fait à la main depuis la
//    boîte mail (recopie du message validé dans Sanity).
export function sendTestimonial(payload) {
  if (TESTIMONIAL_API) {
    return postJson(TESTIMONIAL_API, {
      author: payload.author,
      organisation: payload.organisation,
      message: payload.message,
      rating: payload.rating || null,
      honeypot: payload.honeypot ?? '',
    })
  }

  return postJson(TESTIMONIAL_ENDPOINT, {
    _subject: 'Nouveau message pour le livre d’or',
    Nom: payload.author,
    Structure: payload.organisation,
    Note: payload.rating ? `${payload.rating} / 5` : '',
    Message: payload.message,
    _gotcha: payload.honeypot ?? '',
  })
}

export function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)
}
