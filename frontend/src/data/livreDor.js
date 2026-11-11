// Contenu de repli de la page Livre d'or. Il s'affiche tant que le document
// « Page Livre d'or » n'est pas renseigné dans Sanity, ou si la requête échoue.
//
// Les clés reprennent celles renvoyées par `LIVRE_DOR_QUERY` : la page fusionne
// le résultat de Sanity avec cet objet (voir `lib/queries.js`).
//
// Textes repris de la maquette Figma (frame « Livre d'or » 424:684). La
// maquette répète une phrase d'exemple dans les cartes et n'illustre qu'un
// seul auteur (« M. Henry ») : tant que le back-office n'est pas rempli, on
// garde ces valeurs de démonstration.

const MAQUETTE_TEXTE =
  '“Nous avons adoré travailler avec Neotisse, l’organisation de l’atelier c’est fait rapidement et les visiteurs ont été ravie .'

export const LIVRE_DOR_FALLBACK = {
  page: {
    heroTitle: 'Livre d’or',
    sectionTitle: 'partagez votre avis',
    seeAllLink: {
      label: 'voir tous les commentaires',
      to: '#commentaires',
    },
    featured: {
      message: MAQUETTE_TEXTE,
      author: 'M. Henry',
      organisation: '',
      avatar: null,
    },
    seo: null,
  },
  testimonials: [
    { id: 'temoin-1', author: 'M. Henry', organisation: '', message: MAQUETTE_TEXTE, avatar: null },
    { id: 'temoin-2', author: 'M. Henry', organisation: '', message: MAQUETTE_TEXTE, avatar: null },
    { id: 'temoin-3', author: 'M. Henry', organisation: '', message: MAQUETTE_TEXTE, avatar: null },
  ],
}
