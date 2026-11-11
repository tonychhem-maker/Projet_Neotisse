import { defineField, defineType } from 'sanity'

/**
 * Page « Actualités ».
 *
 * Le titre, le texte d'introduction et le lien « voir plus d'événements »
 * vivent ici. Les cartes d'événements sont composées à partir des documents
 * `post` publiés : les deux plus récents s'affichent, comme dans la maquette.
 */
export const actualitesPage = defineType({
  name: 'actualitesPage',
  title: 'Page Actualités',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Titre', default: true },
    { name: 'seo', title: 'Référencement' },
  ],
  fields: [
    defineField({
      name: 'heroTitle',
      title: 'Titre principal',
      type: 'string',
      group: 'hero',
      initialValue: 'Actualités et événements',
      description: 'Affiché en très grand, centré, en haut de page.',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'introText',
      title: 'Texte d’introduction',
      type: 'text',
      rows: 6,
      group: 'hero',
      description: 'Paragraphe centré sous le titre.',
      validation: (rule) => rule.max(800),
    }),
    defineField({
      name: 'moreLink',
      title: 'Lien « voir plus d’événements »',
      type: 'link',
      group: 'hero',
      description: 'Affiché centré sous les cartes, avant le pied de page.',
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  preview: {
    prepare: () => ({ title: 'Page Actualités' }),
  },
})
