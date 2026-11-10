// Navigation principale du header — ordre imposé par la maquette Figma.
// La page Partenaires n'y figure plus (retirée de l'arborescence principale)
// mais reste accessible via le pied de page.
export const siteNav = [
  { label: 'Accueil', to: '/' },
  { label: 'Ateliers', to: '/ateliers-de-mediation-textile' },
  { label: 'Déplacements', to: '/deplacements' },
  { label: 'Actualités', to: '/actualites' },
  { label: "Livre d'or", to: '/livre-d-or' },
  { label: 'À propos', to: '/a-propos' },
  { label: 'Contact', to: '/contact' },
]

// Liens du pied de page (« Lien Rapide » dans la maquette).
export const footerNav = [
  { label: 'Accueil', to: '/' },
  { label: 'Ateliers', to: '/ateliers-de-mediation-textile' },
  { label: 'À propos', to: '/a-propos' },
  { label: 'Partenaires', to: '/partenaires' },
  { label: 'Contact', to: '/contact' },
]

export const legalNav = [
  { label: 'Mentions légales', to: '/mentions-legales' },
  { label: 'Politique de confidentialité', to: '/politique-de-confidentialite' },
  { label: 'Politique de cookies', to: '/politique-de-cookies' },
]
