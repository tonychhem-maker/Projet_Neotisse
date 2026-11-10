import { defineField, defineType } from 'sanity'

export const workshopFormat = defineType({
  name: 'workshopFormat',
  title: 'Format d’atelier',
  type: 'document',
  description:
    'Les formats présentés sur la page d’accueil (Démonstratif, Participatif, Pour enfants, Sur mesure…). L’ordre d’affichage suit le champ « Ordre ».',
  fields: [
    defineField({
      name: 'title',
      title: 'Nom du format',
      type: 'string',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'number',
      title: 'Numéro affiché',
      type: 'string',
      description:
        'Numéro affiché à gauche du titre (01, 02…). Laissez vide pour une numérotation automatique selon l’ordre.',
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      description: 'Texte affiché lorsque le format est ouvert.',
    }),
    defineField({
      name: 'icon',
      title: 'Pictogramme',
      type: 'image',
      description: 'Icône affichée avec le titre du format (optionnel).',
      options: { hotspot: false },
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Texte alternatif', type: 'string' })],
    }),
    defineField({
      name: 'link',
      title: 'Lien',
      type: 'link',
      description: 'Lien facultatif vers la page ateliers ou la page contact.',
    }),
    defineField({
      name: 'order',
      title: 'Ordre d’affichage',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'visible',
      title: 'Afficher sur le site',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  orderings: [
    { title: 'Ordre', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title', subtitle: 'number', visible: 'visible', media: 'icon' },
    prepare: ({ title, subtitle, visible, media }) => ({
      title: title || 'Format',
      subtitle: [subtitle, visible === false ? '(masqué)' : null]
        .filter(Boolean)
        .join(' — '),
      media,
    }),
  },
})
