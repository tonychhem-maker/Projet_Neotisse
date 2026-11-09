import { defineArrayMember, defineField, defineType } from 'sanity'

export const legalPage = defineType({
  name: 'legalPage',
  title: 'Pages légales',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        list: [
          { title: 'Mentions légales', value: 'mentions-legales' },
          {
            title: 'Politique de confidentialité',
            value: 'politique-de-confidentialite',
          },
          { title: 'Politique de cookies', value: 'politique-de-cookies' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Contenu',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Paragraphe', value: 'normal' },
            { title: 'Titre 2', value: 'h2' },
            { title: 'Titre 3', value: 'h3' },
          ],
          lists: [
            { title: 'Puces', value: 'bullet' },
            { title: 'Numérotée', value: 'number' },
          ],
        }),
      ],
    }),
    defineField({
      name: 'updatedAt',
      title: 'Dernière mise à jour',
      type: 'date',
    }),
  ],
  orderings: [
    {
      title: 'Titre',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'updatedAt' },
    prepare: ({ title, subtitle }) => ({
      title: title || 'Page légale',
      subtitle: subtitle ? `Mis à jour le ${subtitle}` : undefined,
    }),
  },
})
