import { defineField, defineType } from 'sanity'

export const availability = defineType({
  name: 'availability',
  title: 'Disponibilité',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Intitulé',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Lieu',
      type: 'string',
    }),
    defineField({
      name: 'department',
      title: 'Département / région',
      type: 'string',
    }),
    defineField({
      name: 'startDate',
      title: 'Début',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'Fin',
      type: 'date',
    }),
    defineField({
      name: 'status',
      title: 'Statut',
      type: 'string',
      initialValue: 'open',
      options: {
        layout: 'radio',
        list: [
          { title: 'Ouvert aux réservations', value: 'open' },
          { title: 'Complet', value: 'full' },
          { title: 'Passé', value: 'past' },
        ],
      },
    }),
    defineField({
      name: 'note',
      title: 'Note',
      type: 'string',
    }),
  ],
  orderings: [
    { title: 'Date (proche)', name: 'startAsc', by: [{ field: 'startDate', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title', subtitle: 'startDate', status: 'status' },
    prepare: ({ title, subtitle, status }) => ({
      title,
      subtitle: [subtitle, status].filter(Boolean).join(' — '),
    }),
  },
})
