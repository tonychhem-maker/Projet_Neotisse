import { defineField, defineType } from 'sanity'

export const partner = defineType({
  name: 'partner',
  title: 'Partenaire',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nom',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({ name: 'url', title: 'Site web', type: 'url' }),
    defineField({
      name: 'type',
      title: 'Type de structure',
      type: 'string',
      options: {
        list: [
          { title: 'Musée', value: 'musee' },
          { title: 'Université', value: 'universite' },
          { title: 'Coopérative', value: 'cooperative' },
          { title: 'Collectivité', value: 'collectivite' },
          { title: 'Autre', value: 'autre' },
        ],
      },
    }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
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
    select: { title: 'name', subtitle: 'type', media: 'logo' },
  },
})
