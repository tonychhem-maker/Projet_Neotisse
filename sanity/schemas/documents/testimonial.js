import { defineField, defineType } from 'sanity'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Livre d’or',
  type: 'document',
  fields: [
    defineField({
      name: 'author',
      title: 'Nom (ou prénom)',
      type: 'string',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'organisation',
      title: 'Structure / fonction',
      type: 'string',
      description: 'Ex : Musée de préhistoire de Solutré',
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: 'message',
      title: 'Message',
      type: 'text',
      rows: 5,
      validation: (rule) => rule.required().max(1000),
    }),
    defineField({
      name: 'rating',
      title: 'Note',
      type: 'number',
      options: {
        list: [
          { title: '1 étoile', value: 1 },
          { title: '2 étoiles', value: 2 },
          { title: '3 étoiles', value: 3 },
          { title: '4 étoiles', value: 4 },
          { title: '5 étoiles', value: 5 },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'submittedAt',
      title: 'Date de soumission',
      type: 'datetime',
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Date de publication',
      type: 'datetime',
      description: 'Renseignée automatiquement lors de la validation.',
    }),
    defineField({
      name: 'status',
      title: 'Statut',
      type: 'string',
      initialValue: 'pending',
      options: {
        layout: 'radio',
        list: [
          { title: 'En attente de modération', value: 'pending' },
          { title: 'Publié', value: 'published' },
          { title: 'Refusé', value: 'rejected' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      title: 'Publication (récent)',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'author',
      subtitle: 'message',
      status: 'status',
    },
    prepare: ({ title, subtitle, status }) => ({
      title: `${title ?? 'Anonyme'} — ${status === 'published' ? 'publié' : status === 'rejected' ? 'refusé' : 'en attente'}`,
      subtitle: subtitle?.slice(0, 80),
    }),
  },
})
