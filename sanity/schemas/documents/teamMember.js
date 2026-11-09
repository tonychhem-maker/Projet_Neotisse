import { defineField, defineType } from 'sanity'

export const teamMember = defineType({
  name: 'teamMember',
  title: 'Membre de l’équipe',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nom',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Fonction',
      type: 'string',
      description: 'Ex : Médiatrice textile',
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Texte alternatif', type: 'string' })],
    }),
    defineField({ name: 'bio', title: 'Biographie', type: 'text', rows: 4 }),
    defineField({
      name: 'order',
      title: 'Ordre d’affichage',
      type: 'number',
      initialValue: 0,
    }),
  ],
  orderings: [
    { title: 'Ordre', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'name', subtitle: 'role', media: 'photo' },
  },
})
