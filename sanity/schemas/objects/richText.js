import { defineField, defineType } from 'sanity'

export const richText = defineType({
  name: 'richText',
  title: 'Texte riche',
  type: 'array',
  of: [
    {
      type: 'block',
      styles: [
        { title: 'Paragraphe', value: 'normal' },
        { title: 'Titre 3', value: 'h3' },
        { title: 'Citation', value: 'blockquote' },
      ],
      lists: [
        { title: 'Puces', value: 'bullet' },
        { title: 'Numérotée', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Gras', value: 'strong' },
          { title: 'Italique', value: 'em' },
        ],
        annotations: [
          {
            name: 'link',
            title: 'Lien',
            type: 'object',
            fields: [
              defineField({ name: 'href', title: 'URL', type: 'url' }),
              defineField({ name: 'blank', title: 'Nouvel onglet', type: 'boolean' }),
            ],
          },
        ],
      },
    },
  ],
})
