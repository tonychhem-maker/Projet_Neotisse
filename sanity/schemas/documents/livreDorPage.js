import { defineField, defineType } from 'sanity'

/**
 * Page « Livre d'or ».
 *
 * Le titre, le libellé de la section formulaire, le lien « voir tous les
 * commentaires » et le témoignage vedette vivent ici. Les cartes de
 * témoignages sont composées à partir des documents `testimonial` publiés :
 * une même fiche alimente cette page sans double saisie.
 */
export const livreDorPage = defineType({
  name: 'livreDorPage',
  title: 'Page Livre d’or',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Titre', default: true },
    { name: 'vedette', title: 'Témoignage vedette' },
    { name: 'seo', title: 'Référencement' },
  ],
  fields: [
    defineField({
      name: 'heroTitle',
      title: 'Titre principal',
      type: 'string',
      group: 'hero',
      initialValue: 'Livre d’or',
      description: 'Affiché en très grand en haut de page.',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'sectionTitle',
      title: 'Titre du formulaire',
      type: 'string',
      group: 'hero',
      initialValue: 'partagez votre avis',
      description: 'Titre au-dessus des champs du formulaire.',
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: 'seeAllLink',
      title: 'Lien « voir tous les commentaires »',
      type: 'link',
      group: 'hero',
      description:
        'Ancre vers la liste des témoignages (ex. #commentaires) ou une autre page.',
    }),

    defineField({
      name: 'featured',
      title: 'Témoignage vedette',
      description:
        'Le grand témoignage affiché sous le titre, avec son auteur et son portrait.',
      type: 'object',
      group: 'vedette',
      fields: [
        defineField({
          name: 'message',
          title: 'Message',
          type: 'text',
          rows: 5,
          validation: (rule) => rule.max(1200),
        }),
        defineField({
          name: 'author',
          title: 'Nom (ou prénom)',
          type: 'string',
          validation: (rule) => rule.max(60),
        }),
        defineField({
          name: 'organisation',
          title: 'Structure / fonction',
          type: 'string',
          validation: (rule) => rule.max(120),
        }),
        defineField({
          name: 'avatar',
          title: 'Portrait',
          type: 'image',
          options: { hotspot: true },
          description:
            'Le portrait rond à côté du nom. Sans image, un cercle gris neutre est affiché.',
          fields: [defineField({ name: 'alt', title: 'Texte alternatif', type: 'string' })],
        }),
      ],
    }),

    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  preview: {
    prepare: () => ({ title: 'Page Livre d’or' }),
  },
})
