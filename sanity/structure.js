export const singletonTypes = new Set([
  'siteSettings',
  'homePage',
  'ateliersPage',
  'aboutPage',
  'contactInfo',
])

export function deskStructure(S) {
  const apiVersion = '2026-01-01'

  return S.list()
    .title('Contenu')
    .items([
      S.listItem()
        .title('Page d’accueil')
        .id('homePage')
        .child(S.document().schemaType('homePage').documentId('homePage')),
      S.listItem()
        .title('Page Ateliers')
        .id('ateliersPage')
        .child(S.document().schemaType('ateliersPage').documentId('ateliersPage')),
      S.listItem()
        .title('Page À propos')
        .id('aboutPage')
        .child(S.document().schemaType('aboutPage').documentId('aboutPage')),
      S.listItem()
        .title('Page Contact')
        .id('contactInfo')
        .child(S.document().schemaType('contactInfo').documentId('contactInfo')),

      S.divider(),

      S.documentTypeListItem('workshop').title('Ateliers'),
      S.documentTypeListItem('workshopFormat').title('Formats d’atelier'),
      S.documentTypeListItem('availability').title('Disponibilités'),
      S.documentTypeListItem('post').title('Actualités'),
      S.documentTypeListItem('teamMember').title('Équipe'),
      S.documentTypeListItem('partner').title('Partenaires'),

      S.divider(),

      S.listItem()
        .title('Livre d’or')
        .child(
          S.list()
            .title('Livre d’or')
            .items([
              S.listItem()
                .title('En attente de modération')
                .child(
                  S.documentList()
                    .title('En attente')
                    .apiVersion(apiVersion)
                    .filter('_type == "testimonial" && status == "pending"')
                    .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }]),
                ),
              S.listItem()
                .title('Publiés')
                .child(
                  S.documentList()
                    .title('Publiés')
                    .apiVersion(apiVersion)
                    .filter('_type == "testimonial" && status == "published"')
                    .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }]),
                ),
              S.listItem()
                .title('Refusés')
                .child(
                  S.documentList()
                    .title('Refusés')
                    .apiVersion(apiVersion)
                    .filter('_type == "testimonial" && status == "rejected"'),
                ),
              S.documentTypeListItem('testimonial').title('Tous les messages'),
            ]),
        ),

      S.divider(),

      S.documentTypeListItem('legalPage').title('Pages légales'),

      S.divider(),

      S.listItem()
        .title('Réglages du site')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
    ])
}
