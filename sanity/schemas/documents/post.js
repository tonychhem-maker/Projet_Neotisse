import { defineField, defineType } from 'sanity'

export const post = defineType({
  name: 'post',
  title: 'Actualité',
  type: 'document',
  groups: [
    { name: 'content', title: 'Contenu', default: true },
    { name: 'meta', title: 'Publication' },
    { name: 'seo', title: 'Référencement' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
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
      name: 'excerpt',
      title: 'Résumé',
      type: 'text',
      rows: 3,
      group: 'content',
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: 'kicker',
      title: 'Sur-titre',
      type: 'string',
      group: 'content',
      description:
        'Petit texte vert affiché au-dessus du titre de la carte (ex : « Musée - »). Si vide, il est dérivé de la catégorie.',
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: 'eventDate',
      title: 'Date de l’événement',
      type: 'date',
      group: 'content',
      description:
        'Seuls le mois et l’année sont affichés sur la carte (ex : octobre 2027). Si vide, la date de publication est utilisée.',
    }),
    defineField({
      name: 'dateLabel',
      title: 'Précision de date',
      type: 'string',
      group: 'content',
      description: 'Affichée sous le mois sur la carte (ex : du 9 au 10).',
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: 'link',
      title: 'Lien « voir plus » de la carte',
      type: 'link',
      group: 'content',
      description:
        'Optionnel : sans lien, la carte n’affiche pas son bouton « voir plus ».',
    }),
    defineField({
      name: 'coverImage',
      title: 'Image de couverture',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Texte alternatif', type: 'string' })],
    }),
    defineField({ name: 'body', title: 'Contenu', type: 'richText', group: 'content' }),
    defineField({
      name: 'publishedAt',
      title: 'Date de publication',
      type: 'datetime',
      group: 'meta',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Auteur',
      type: 'reference',
      to: [{ type: 'teamMember' }],
      group: 'meta',
    }),
    defineField({
      name: 'category',
      title: 'Catégorie',
      type: 'string',
      group: 'meta',
      options: {
        list: [
          { title: 'Événement', value: 'evenement' },
          { title: 'Atelier', value: 'atelier' },
          { title: 'Partenariat', value: 'partenariat' },
          { title: 'Presse', value: 'presse' },
        ],
      },
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  orderings: [
    {
      title: 'Publication (récent)',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'publishedAt', media: 'coverImage' },
    prepare: ({ title, subtitle, media }) => ({
      title,
      subtitle: subtitle ? new Date(subtitle).toLocaleDateString('fr-FR') : 'Brouillon',
      media,
    }),
  },
})
