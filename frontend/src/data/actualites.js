// Contenu de repli de la page Actualités. Il s'affiche tant que ni le
// document « Page Actualités » ni les documents « Actualité » (post) ne sont
// renseignés dans Sanity, ou si la requête échoue.
//
// Les clés reprennent celles renvoyées par `ACTUALITES_QUERY` (voir
// `lib/queries.js`). La maquette Figma (frame « Actualités » 424:683)
// répète deux fois la même carte d'exemple (« Musée - Festival
// d'Archéologie Expérimentale d'Occitanie », octobre 2027) : tant que le
// back-office n'est pas rempli, on garde ces valeurs de démonstration. Les
// coquilles de la maquette (« Actualities », « évnements ») sont corrigées
// ici en français normalisé.
//
// L'image de la carte est l'export de la maquette (photo teintée #E4DCCE).

import carteFestival from '../assets/actualites/carte-festival.jpg'

export const ACTUALITES_FALLBACK = {
  page: {
    heroTitle: 'Actualités et\nevénements',
    introText:
      'Initiez-vous au tissage aux tablettes et réalisez votre propre galon ! Cette technique ancienne permet de produire des bandes textiles étroites à l’aide de petites tablettes percées, qui servent à organiser et à manipuler les fils. Au fil de l’atelier, les participants découvrent le fonctionnement de cet outil, comprennent le principe de l’entrecroisement des fils et expérimentent les gestes nécessaires à la réalisation d’un galon.',
    moreLink: {
      label: 'voir plus d’événements',
      to: '/actualites',
    },
  },
  posts: [
    {
      id: 'demo-1',
      kicker: 'Musée -',
      title: 'Festival d’Archéologie Expérimentale d’Occitanie',
      monthYear: 'octobre 2027',
      dateLabel: 'du 9 au 10',
      link: { label: 'voir plus', to: '/actualites' },
      image: { src: carteFestival, alt: '' },
    },
    {
      id: 'demo-2',
      kicker: 'Musée -',
      title: 'Festival d’Archéologie Expérimentale d’Occitanie',
      monthYear: 'octobre 2027',
      dateLabel: 'du 9 au 10',
      link: { label: 'voir plus', to: '/actualites' },
      image: { src: carteFestival, alt: '' },
    },
  ],
}
