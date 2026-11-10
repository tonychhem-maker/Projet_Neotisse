// Contenu de repli de l'accueil. Il s'affiche tant que le back-office Sanity
// n'est pas renseigné, ou si la requête échoue.

export const HERO_IMAGES = [
  '/assets/images/tissage-tablettes.jpg',
  '/assets/images/filage-fuseau.jpg',
  '/assets/images/tissage-fleche.jpg',
  '/assets/images/table-ronde.jpg',
]

export const HERO_TITLE_LINES = ['Ateliers de', 'Médiations', 'Tissage pour', 'Tous']

export const HERO_TITLE = 'Ateliers de médiations, le tissage pour tous'

export const ABOUT_FALLBACK = {
  title: 'Neotisse',
  imageSrc: '/assets/images/tissage-fleche.jpg',
  imageAlt: 'Galons tissés à chevrons présentés dans une vitrine',
  paragraphs: [
    'Fondée en mai 2024 et basée à Montpellier, Neotisse est une association loi 1901 dédiée à la médiation scientifique autour des savoir-faire textiles anciens, du Néolithique au Moyen Âge.',
    'Elle conçoit et anime des ateliers démonstratifs et participatifs à destination des musées et des structures culturelles, afin de faire découvrir au public les techniques textiles du passé et de mettre en lumière un patrimoine encore trop souvent méconnu.',
  ],
}

export const FORMATS_FALLBACK = [
  {
    id: '01',
    title: 'DÉMONSTRATIF',
    image: '/assets/images/tissage-fleche.jpg',
    text: 'La démonstration s’installe dans votre structure : gestes, matières et outils sont présentés au public, qui peut observer le travail de près et poser ses questions.',
  },
  {
    id: '02',
    title: 'PARTICIPATIF',
    image: '/assets/images/tissage-tablettes.jpg',
    text: 'Le public passe de l’observation à la pratique : chacun apprend un geste textile simple, sur un métier ou une tablette, et repart avec sa réalisation.',
  },
  {
    id: '03',
    title: 'POUR ENFANTS',
    image: '/assets/images/tissage-tablettes.jpg',
    text: 'Des ateliers courts et ludiques, adaptés aux plus jeunes, pour découvrir les gestes du tissage et l’histoire des textiles anciens en s’amusant.',
  },
  {
    id: '04',
    title: 'SUR MESURE',
    image: '/assets/images/filage-fuseau.jpg',
    text: 'Parlons de votre projet ensemble, Neotisse vous propose d’organiser un atelier à votre image pour vos besoins',
  },
]

export const PARTNERS_FALLBACK = {
  title: ['Nos', 'partenaires'],
  row1: [
    { name: 'Gergovie', src: '/assets/logos/gergovie.png', w: 210 },
    { name: 'Lozère Tourisme', src: '/assets/logos/lozere.png', w: 135 },
    { name: 'CERAC', src: '/assets/logos/cerac.png', w: 70 },
  ],
  row2: [
    { name: 'Musée de Tautavel', src: '/assets/logos/tautavel.png', w: 215 },
    { name: 'Festival du Lin', src: '/assets/logos/festival-lin.png', w: 140 },
  ],
}

export const CTA_FALLBACK = {
  titleLine1: 'Prêt à organiser votre',
  titleLine2: 'atelier',
  label: 'Contactez-nous',
  to: '/contact',
}
