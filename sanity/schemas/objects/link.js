import { defineField, defineType } from 'sanity'

export const link = defineType({
  name: 'link',
  title: 'Lien',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Libellé',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Type de lien',
      type: 'string',
      initialValue: 'internal',
      options: {
        layout: 'radio',
        list: [
          { title: 'Page du site', value: 'internal' },
          { title: 'Site externe', value: 'external' },
        ],
      },
    }),
    defineField({
      name: 'internalPath',
      title: 'Chemin interne',
      type: 'string',
      description: 'Ex : /ateliers-de-mediation-textile',
      hidden: ({ parent }) => parent?.type !== 'internal',
      validation: (rule) =>
        rule.custom((value, context) => {
          if (context.parent?.type === 'internal' && !value) return 'Champ requis'
          return true
        }),
    }),
    defineField({
      name: 'externalUrl',
      title: 'URL externe',
      type: 'url',
      hidden: ({ parent }) => parent?.type !== 'external',
      validation: (rule) =>
        rule.custom((value, context) => {
          if (context.parent?.type === 'external' && !value) return 'Champ requis'
          return true
        }),
    }),
  ],
  preview: {
    select: { title: 'label', subtitle: 'internalPath', url: 'externalUrl' },
    prepare: ({ title, subtitle, url }) => ({
      title: title || 'Lien',
      subtitle: url || subtitle,
    }),
  },
})
