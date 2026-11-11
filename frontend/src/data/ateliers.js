// Contenu de repli de la page Ateliers. Il s'affiche tant que le document
// « Page Ateliers » n'est pas renseigné dans Sanity, ou si la requête échoue.
//
// Les clés du bloc `page` reprennent celles renvoyées par `ATELIERS_QUERY` :
// la page fusionne le résultat de Sanity avec cet objet (voir `lib/queries.js`).

export const ATELIERS_FALLBACK = {
  heroTitle: 'Ateliers sur-mesure',
  heroText: [
    'Initiez-vous au tissage aux tablettes et réalisez votre propre œuvre.',
    'Avec les ateliers personnalisables et sur-mesure de Neotisse,',
    'proposez un atelier de médiation adapté à vos besoins et ceux de vos publics.',
    'Contactez-nous pour organiser votre prochain atelier à votre image.',
  ],
  heroImage: {
    src: '/assets/images/ateliers/hero-atelier.jpg',
    alt: 'Mains guidant les fils sur un métier à tisser',
  },
  secondaryTitle: '',
  secondarySections: [],
  ctaTitle: 'Convaincu ?',
  ctaLink: {
    label: 'organiser votre atelier',
    to: '/contact',
  },
}
// Texte commun aux trois formats mis en avant sur la maquette.
const FORMAT_TEXT =
  'Initiez-vous au tissage aux tablettes et réalisez votre propre galon ! Cette technique ancienne permet de produire des bandes textiles étroites à l’aide de petites tablettes percées, qui servent à organiser et à manipuler les fils. Au fil de l’atelier, les participants découvrent le fonctionnement de cet outil, comprennent le principe de l’entrecroisement des fils et expérimentent les gestes nécessaires à la réalisation d’un galon.'

export const ATELIERS_FORMATS_FALLBACK = [
  {
    id: 'participatif',
    title: 'PARTICIPATIF',
    text: FORMAT_TEXT,
    image: '/assets/images/ateliers/format-1.jpg',
  },
  {
    id: 'enfants',
    title: 'ENFANTS',
    text: FORMAT_TEXT,
    image: '/assets/images/ateliers/format-2.jpg',
  },
  {
    id: 'demonstratif',
    title: 'DÉMONSTRATIF',
    text: FORMAT_TEXT,
    image: '/assets/images/ateliers/format-3.jpg',
  },
]

const SECONDARY_TEXT =
  'Initiez-vous au tissage aux tablettes et réalisez votre propre galon ! Cette technique ancienne permet de produire des bandes textiles étroites à l’aide de petites tablettes percées, qui servent à organiser et à manipuler les fils. Au fil de l’atelier, les participants découvrent le fonctionnement de cet outil, comprennent le principe de l’entrecroisement des fils et expérimentent les gestes nécessaires à la réalisation d’un galon.'

export const SECONDARY_SECTIONS_FALLBACK = [
  { _key: 'conference', title: 'CONFÉRENCE', text: SECONDARY_TEXT },
  { _key: 'archeologie', title: 'EXPÉRIMENTATION ARCHÉOLOGIQUE', text: SECONDARY_TEXT },
]
