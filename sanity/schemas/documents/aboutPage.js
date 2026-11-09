import { defineField, defineType } from 'sanity'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'Page À propos',
  type: 'document',
  groups: [
    { name: 'content', title: 'Contenu', default: true },
    { name: 'seo', title: 'Référencement' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      group: 'content',
      initialValue: 'À propos de Neotisse',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Introduction',
      type: 'text',
      rows: 3,
      group: 'content',
    }),
    defineField({
      name: 'body',
      title: 'Contenu',
      type: 'richText',
      group: 'content',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Texte alternatif', type: 'string' })],
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  preview: {
    prepare: () => ({ title: 'Page À propos' }),
  },
})
