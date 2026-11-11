import { defineField, defineType } from 'sanity'

// Singleton « Page Déplacements » : reprend le titre de la maquette et un
// bloc SEO. La liste des déplacements elle-même est gérée par les documents
// « Déplacement » (un par date).
export const deplacementsPage = defineType({
  name: 'deplacementsPage',
  title: 'Page Déplacements',
  type: 'document',
  fields: [
    defineField({
      name: 'heroTitle',
      title: 'Titre principal',
      type: 'string',
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
  preview: {
    select: { title: 'heroTitle' },
    prepare: ({ title }) => ({ title: title || 'Page Déplacements' }),
  },
})
