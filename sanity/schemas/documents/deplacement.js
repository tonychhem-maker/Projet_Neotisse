import { defineField, defineType } from 'sanity'

// Un déplacement = une ligne de la page : une date, une ville et
// éventuellement le partenaire dont le logo accompagne la ligne.
export const deplacement = defineType({
  name: 'deplacement',
  title: 'Déplacement',
  type: 'document',
  fields: [
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'city',
      title: 'Ville',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'partner',
      title: 'Partenaire accueilli',
      type: 'reference',
      to: [{ type: 'partner' }],
    }),
    defineField({
      name: 'order',
      title: 'Ordre d’affichage',
      type: 'number',
      initialValue: 0,
    }),
  ],
  orderings: [
    { title: 'Date (proche d’abord)', name: 'dateAsc', by: [{ field: 'date', direction: 'asc' }] },
    { title: 'Ordre manuel', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { city: 'city', date: 'date', partner: 'partner.name' },
    prepare: ({ city, date, partner }) => ({
      title: city || 'Déplacement',
      subtitle: [
        date ? new Date(`${date}T12:00:00`).toLocaleDateString('fr-FR') : null,
        partner,
      ]
        .filter(Boolean)
        .join(' — '),
    }),
  },
})
