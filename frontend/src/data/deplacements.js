// Contenu de repli de la page Déplacements. Il s'affiche tant que ni le
// document « Page Déplacements » ni les documents « Déplacement » ne sont
// renseignés dans Sanity, ou si la requête échoue.
//
// Les clés reprennent celles renvoyées par `DEPLACEMENTS_QUERY` (voir
// `lib/queries.js`). La maquette Figma (frame « Déplacements » 446:1739)
// répète quatre fois la même ligne d'exemple (« Le 2 novembre 2027 — Paris »
// avec le logo Lozère tourisme) : tant que le back-office n'est pas rempli,
// on garde ces valeurs de démonstration.

export const DEPLACEMENTS_FALLBACK = {
  page: {
    heroTitle: 'Nos destinations prévue',
  },
  items: [
    { _id: 'demo-1', date: '2027-11-02', city: 'Paris', partnerName: 'Lozère tourisme', partnerLogo: null },
    { _id: 'demo-2', date: '2027-11-02', city: 'Paris', partnerName: 'Lozère tourisme', partnerLogo: null },
    { _id: 'demo-3', date: '2027-11-02', city: 'Paris', partnerName: 'Lozère tourisme', partnerLogo: null },
    { _id: 'demo-4', date: '2027-11-02', city: 'Paris', partnerName: 'Lozère tourisme', partnerLogo: null },
  ],
}
