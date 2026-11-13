// Contenu de repli de la page Déplacements. Il s'affiche tant que ni le
// document « Page Déplacements » ni les documents « Déplacement » ne sont
// renseignés dans Sanity, ou si la requête échoue.
//
// Les clés reprennent celles renvoyées par `DEPLACEMENTS_QUERY` (voir
// `lib/queries.js`). La maquette Figma (frame « Déplacements » 424:711)
// répète quatre fois la même ligne d'exemple (« Le 2 novembre 2027 — Paris »
// avec le logo Lozère tourisme) : tant que le back-office n'est pas rempli,
// on garde ces valeurs de démonstration. `codePostal` positionne le point
// vert sur la carte de France interactive (75001 = Paris) ; `note` alimente
// la bulle d'information du point. Les coquilles de la maquette
// (« mobilitées », « plannifier », « évenments ») sont corrigées ici en
// français normalisé.
//
// La vignette événement du bas de page reprend la dernière actualité (image
// exportée de la maquette).

import carteEvenement from '../assets/deplacements/carte-evenement.jpg'

export const DEPLACEMENTS_FALLBACK = {
  page: {
    heroTitle: 'Nos prochaines mobilités',
    introTitle: 'Retrouvez nos déplacements',
    introText:
      'Découvrez où Neotisse se déplace et quand, pour vous aider à planifier votre propre rendez-vous avec nous.',
    ctaLink: {
      label: 'Contactez nous',
      to: '/contact',
    },
    eventsTitle: 'Découvrez également nos événements',
  },
  items: [
    { _id: 'demo-1', date: '2027-11-02', city: 'Paris', codePostal: '75001', note: null, logo: null },
    { _id: 'demo-2', date: '2027-11-02', city: 'Paris', codePostal: '75001', note: null, logo: null },
    { _id: 'demo-3', date: '2027-11-02', city: 'Paris', codePostal: '75001', note: null, logo: null },
    { _id: 'demo-4', date: '2027-11-02', city: 'Paris', codePostal: '75001', note: null, logo: null },
  ],
  event: {
    id: 'demo-event',
    slug: 'festival-archeologie-experimentale-occitanie',
    kicker: 'Musée -',
    title: 'Festival d’Archéologie Expérimentale d’Occitanie',
    monthYear: 'octobre 2027',
    dateLabel: 'du 9 au 10',
    link: null,
    image: { src: carteEvenement, alt: '' },
  },
}
