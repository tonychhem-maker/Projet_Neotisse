import { defineField, defineType } from 'sanity'

// Un déplacement = un événement de la page : une date, une ville, le logo
// du partenaire accueilli, et un code postal qui positionne le point vert
// sur la carte de France interactive (géocodé via geo.api.gouv.fr). Le
// champ « note » alimente la bulle d'information du point. Les événements
// s'ajoutent et se suppriment librement ; ils sont triés par date (ou par
// ordre manuel).
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
      name: 'logo',
      title: 'Logo (partenaire accueilli)',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Texte alternatif',
          type: 'string',
          description: 'Ex : « Logo Lozère tourisme ». Laisse vide pour masquer l’image aux lecteurs d’écran.',
        }),
      ],
    }),
    defineField({
      name: 'codePostal',
      title: 'Code postal (carte de France)',
      type: 'string',
      description:
        'Positionne le point vert sur la carte de la page Déplacements (géocodé via geo.api.gouv.fr). Sans code postal, le déplacement apparaît dans la liste mais pas sur la carte.',
    }),
    defineField({
      name: 'note',
      title: 'Petit texte (bulle de la carte)',
      type: 'text',
      rows: 3,
      description:
        'Court texte affiché dans la bulle qui s’ouvre au passage sur le point vert de la carte.',
    }),
    defineField({
      name: 'order',
      title: 'Ordre d’affichage (si dates égales)',
      type: 'number',
      initialValue: 0,
    }),
  ],
  orderings: [
    { title: 'Date (proche d’abord)', name: 'dateAsc', by: [{ field: 'date', direction: 'asc' }] },
    { title: 'Ordre manuel', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { city: 'city', date: 'date', codePostal: 'codePostal', media: 'logo' },
    prepare: ({ city, date, codePostal, media }) => ({
      title: city || 'Déplacement',
      media,
      subtitle: [
        date ? new Date(`${date}T12:00:00`).toLocaleDateString('fr-FR') : null,
        codePostal,
      ]
        .filter(Boolean)
        .join(' — '),
    }),
  },
})
