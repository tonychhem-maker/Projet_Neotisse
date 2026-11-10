const CONTACT_ENDPOINT =
  import.meta.env.VITE_CONTACT_FORM_ENDPOINT ?? 'https://formspree.io/f/REMPLACER_PAR_VOTRE_ID'

const TESTIMONIAL_ENDPOINT =
  import.meta.env.VITE_TESTIMONIAL_FORM_ENDPOINT ?? CONTACT_ENDPOINT

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

// Livre d'or → Formspree. Le message est ensuite validé manuellement dans Sanity.
export function sendTestimonial({ author, organisation, message, rating, honeypot }) {
  return postJson(TESTIMONIAL_ENDPOINT, {
    _subject: 'Nouveau message pour le livre d’or',
    Nom: author,
    Structure: organisation,
    Note: rating ? `${rating} / 5` : '',
    Message: message,
    _gotcha: honeypot ?? '',
  })
}

export function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)
}
