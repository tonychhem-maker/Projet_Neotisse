// Contenu de repli de la page À propos. Il s'affiche tant que le document
// « Page À propos » n'est pas renseigné dans Sanity, ou si la requête échoue.
//
// Les clés du bloc `page` reprennent celles renvoyées par `ABOUT_QUERY` :
// la page fusionne le résultat de Sanity avec cet objet (voir `lib/queries.js`).
//
// Textes et photos repris de la maquette Figma (frame « A propos » 424:445) ;
// les photos sont les exports des blocs d'image, rangés dans
// public/assets/images/apropos.

// Texte de biographie posé dans la maquette (placeholder de la designer).
const BIO_TEXT =
  'Initiez-vous au tissage aux tablettes et réalisez votre propre galon ! Cette technique ancienne permet de produire des bandes textiles étroites à l’aide de petites tablettes percées, qui servent à organiser et à manipuler les fils. Au fil de l’atelier, les participants découvrent le fonctionnement de cet outil, comprennent le principe de l’entrecroisement des fils et expérimentent les gestes nécessaires à la réalisation d’un galon.'

export const APROPOS_FALLBACK = {
  // Le retour à la ligne marque la césure du titre sur deux lignes.
  heroTitle: 'Ateliers de médiations\nsur le tissage pour tous',
  heroText: [
    'Découvrez Neotisse, une association passionnante et son équipe, née de la passion du tissage et fruit de l’envie de partager ce savoir avec une expertise accessible à tous et à toutes',
  ],
  bannerImage: {
    src: '/assets/images/apropos/bandeau-neotisse.jpg',
    alt: 'Fils de laine et métier à tisser en bois',
  },
  bannerTitle: 'Neotisse',
  histoireTitle: 'L’histoire de l’association',
  histoireText: BIO_TEXT,
  histoireImage: {
    src: '/assets/images/apropos/histoire.jpg',
    alt: 'Séance de médiation textile autour des fils et des écheveaux',
  },
  members: [
    {
      id: 'marie-salome-perrichon',
      name: 'Marie-Salomé Perrichon',
      role: 'Co-créatrice',
      bio: BIO_TEXT,
      photo: {
        src: '/assets/images/apropos/portrait-1.jpg',
        alt: 'Marie-Salomé Perrichon manipulant des fils teints dans un atelier',
      },
    },
    {
      id: 'emile-roma-sert',
      name: 'Émile Roma Sert',
      role: 'Co-créatrice',
      bio: BIO_TEXT,
      photo: {
        src: '/assets/images/apropos/portrait-2.jpg',
        alt: 'Émile Roma Sert manipulant des fils teints dans un atelier',
      },
    },
  ],
  moreLink: {
    label: 'voir plus sur nos collaborateur',
    to: '/contact',
  },
}
