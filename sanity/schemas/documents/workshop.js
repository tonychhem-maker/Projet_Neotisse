import { defineField, defineType } from 'sanity'

export const workshop = defineType({
  name: 'workshop',
  title: 'Atelier',
  type: 'document',
  groups: [
    { name: 'content', title: 'Contenu', default: true },
    { name: 'practical', title: 'Informations pratiques' },
    { name: 'seo', title: 'Référencement' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Nom de l’atelier',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Résumé court',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'Utilisé dans les cartes de la page d’accueil.',
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: 'body',
      title: 'Description',
      type: 'richText',
      group: 'content',
    }),
    defineField({
      name: 'coverImage',
      title: 'Image principale',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Texte alternatif', type: 'string' })],
    }),
    defineField({
      name: 'period',
      title: 'Période historique',
      type: 'string',
      group: 'practical',
      options: {
        list: [
          { title: 'Néolithique', value: 'neolithique' },
          { title: 'Antiquité', value: 'antiquite' },
          { title: 'Moyen Âge', value: 'moyen-age' },
          { title: 'Transversal', value: 'transversal' },
        ],
      },
    }),
    defineField({
      name: 'audience',
      title: 'Public',
      type: 'array',
      group: 'practical',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Scolaires', value: 'Scolaires' },
          { title: 'Familles', value: 'Familles' },
          { title: 'Adultes', value: 'Adultes' },
          { title: 'Universitaires', value: 'Universitaires' },
          { title: 'Professionnels', value: 'Professionnels' },
        ],
      },
    }),
    defineField({
      name: 'duration',
      title: 'Durée',
      type: 'string',
      group: 'practical',
      description: 'Ex : 1 h 30',
    }),
    defineField({
      name: 'capacity',
      title: 'Capacité',
      type: 'string',
      group: 'practical',
      description: 'Ex : 15 personnes par groupe',
    }),
    defineField({
      name: 'featured',
      title: 'Mettre en avant',
      type: 'boolean',
      group: 'practical',
      initialValue: false,
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  orderings: [
    { title: 'Nom', name: 'titleAsc', by: [{ field: 'title', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title', subtitle: 'period', media: 'coverImage' },
  },
})
