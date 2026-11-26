// Liste fermée des mesures déjà disponibles dans les agrégats Sanity.
export const METRICS = [
  { value: 'views', title: 'Pages vues' },
  { value: 'visits', title: 'Visites' },
  { value: 'engagedVisits', title: 'Visites avec message envoyé' },
  { value: 'clicks', title: 'Clics d’intention' },
  { value: 'contact_click', title: 'Clics vers Contact' },
  { value: 'contact_submit', title: 'Messages de contact envoyés' },
  { value: 'testimonial_open', title: 'Clics vers le livre d’or' },
  { value: 'testimonial_submit', title: 'Messages du livre d’or envoyés (avec consentement)' },
  { value: 'workshop_open', title: 'Ouvertures de formats d’atelier' },
  { value: 'article_open', title: 'Clics vers une actualité' },
  { value: 'google', title: 'Visites venant de Google' },
  { value: 'direct', title: 'Visites directes ou d’origine inconnue' },
  { value: 'actualiteViews', title: 'Vues des actualités' },
  { value: 'testimonials', title: 'Avis reçus (documents du livre d’or)' },
]

export const METRIC_LABELS = Object.fromEntries(METRICS.map(item => [item.value, item.title]))
