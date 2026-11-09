import { defineField, defineType } from 'sanity'

export const openGraph = defineType({
  name: 'openGraph',
  title: 'Partage sur les réseaux',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({ name: 'title', title: 'Titre', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Format recommandé : 1200 × 630 px',
    }),
  ],
})
