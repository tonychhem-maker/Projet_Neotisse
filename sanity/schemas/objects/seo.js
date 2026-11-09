import { defineField, defineType } from 'sanity'

export const seo = defineType({
  name: 'seo',
  title: 'Référencement',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: 'title',
      title: 'Titre SEO',
      type: 'string',
      description: '60 caractères maximum',
      validation: (rule) => rule.max(60).warning('Au-delà de 60 caractères, le titre peut être tronqué.'),
    }),
    defineField({
      name: 'description',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      description: '160 caractères maximum',
      validation: (rule) => rule.max(160).warning('Au-delà de 160 caractères, la description peut être tronquée.'),
    }),
    defineField({ name: 'openGraph', title: 'Réseaux sociaux', type: 'openGraph' }),
  ],
})
