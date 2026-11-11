// Contenu de repli de la page Livre d'or. Il s'affiche tant que le document
// « Page Livre d'or » n'est pas renseigné dans Sanity, ou si la requête échoue.
//
// Les clés reprennent celles renvoyées par `LIVRE_DOR_QUERY` : la page fusionne
// le résultat de Sanity avec cet objet (voir `lib/queries.js`).
//
// Textes repris de la maquette Figma (frame « Livre d'or » 424:684). La
// maquette n'illustre qu'un seul auteur (« M. Henry ») : la vedette garde ce
// texte ; les trois témoignages des cartes sont fictifs et distincts pour
// rendre visibles le carrousel (flèches + défilement automatique) et les
// cartes tant que le back-office n'est pas rempli. Le premier duplique
// volontairement la vedette : la galerie de la page le dédoublonne, la carte,
// elle, reste conforme à la maquette.

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
    {
      id: 'temoin-2',
      author: 'Claire Fontaine',
      organisation: 'Musée de préhistoire de Solutré',
      message:
        '“Un accueil chaleureux et des ateliers adaptés à tous les âges : petits et grands repartent avec de beaux souvenirs.',
      avatar: null,
    },
    {
      id: 'temoin-3',
      author: 'Julien Martin',
      organisation: 'Groupe scolaire Saint-Exupéry',
      message:
        '“Une équipe à l’écoute et un atelier de tissage passionnant. Nous reviendrons avec grand plaisir.',
      avatar: null,
    },
  ],
}
