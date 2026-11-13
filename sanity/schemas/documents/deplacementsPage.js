import { defineField, defineType } from 'sanity'

// Singleton « Page Déplacements » : reprend les textes de la maquette et un
// bloc SEO. La liste des déplacements elle-même est gérée par les documents
// « Déplacement » (un par date), et la carte « événements » en bas de page
// reprend la dernière actualité publiée.
export const deplacementsPage = defineType({
  name: 'deplacementsPage',
  title: 'Page Déplacements',
  type: 'document',
  fields: [
    defineField({
      name: 'heroTitle',
      title: 'Titre principal',
      type: 'string',
      description: 'Ex : Nos prochaines mobilités',
    }),
    defineField({
      name: 'introTitle',
      title: 'Titre de la carte d’introduction',
      type: 'string',
      description: 'Ex : retrouvez nos déplacements',
    }),
    defineField({
      name: 'introText',
      title: 'Texte de la carte d’introduction',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'ctaLink',
      title: 'Bouton de la carte',
      type: 'link',
    }),
    defineField({
      name: 'eventsTitle',
      title: 'Titre de la section événements',
      type: 'string',
      description: 'Ex : Découvrez également nos événements',
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
  preview: {
    select: { title: 'heroTitle' },
    prepare: ({ title }) => ({ title: title || 'Page Déplacements' }),
  },
})
