import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * Page « Ateliers de médiation textile ».
 *
 * Le contenu éditorial (bannière, introduction, sections, bloc final) vit ici.
 * La liste des formats est composée à partir des documents `workshopFormat`
 * existants : une même fiche alimente l'accueil et cette page, sans double
 * saisie.
 */
export const ateliersPage = defineType({
  name: 'ateliersPage',
  title: 'Page Ateliers',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Bannière', default: true },
    { name: 'formats', title: 'Formats' },
    { name: 'secondary', title: 'Sections secondaires' },
    { name: 'cta', title: 'Bloc final' },
    { name: 'seo', title: 'Référencement' },
  ],
  fields: [
    defineField({
      name: 'heroTitle',
      title: 'Titre principal',
      type: 'string',
      group: 'hero',
      initialValue: 'Ateliers sur-mesure',
      description: 'Affiché en très grand sur une seule ligne : le premier mot est animé depuis la gauche, le second depuis la droite.',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'heroText',
      title: 'Texte de la bannière',
      type: 'text',
      rows: 5,
      group: 'hero',
      description:
        'Chaque retour à la ligne crée un paragraphe. Le texte est centré sous le titre.',
    }),
    defineField({
      name: 'heroImage',
      title: 'Image de la bannière',
      type: 'image',
      group: 'hero',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Texte alternatif', type: 'string' })],
    }),

    defineField({
      name: 'formats',
      title: 'Formats affichés',
      type: 'array',
      group: 'formats',
      description:
        'Sélectionnez et ordonnez les formats de cette page. Le premier est affiché d’emblée, les suivants sont masqués derrière le bouton « voir plus d’ateliers ». Laissez vide pour afficher tous les formats visibles.',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'workshopFormat' }] })],
    }),

    defineField({
      name: 'secondaryTitle',
      title: 'Titre des sections secondaires',
      type: 'string',
      group: 'secondary',
      description:
        'Titre commun facultatif, affiché au-dessus des deux colonnes (ex. « Nos autres interventions »).',
    }),
    defineField({
      name: 'secondarySections',
      title: 'Sections secondaires',
      type: 'array',
      group: 'secondary',
      description: 'Deux sections s’affichent côte à côte sur cet écran (ex. Conférence, Expérimentation archéologique).',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'secondarySection',
          title: 'Section',
          fields: [
            defineField({
              name: 'title',
              title: 'Titre',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'text',
              title: 'Texte',
              type: 'text',
              rows: 6,
            }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'text' },
          },
        }),
      ],
      validation: (rule) => rule.max(2).warning('La maquette prévoit deux colonnes.'),
    }),

    defineField({
      name: 'ctaTitle',
      title: 'Titre du bloc final',
      type: 'string',
      group: 'cta',
      initialValue: 'Convaincu ?',
    }),
    defineField({
      name: 'ctaLink',
      title: 'Bouton du bloc final',
      type: 'link',
      group: 'cta',
    }),

    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  preview: {
    prepare: () => ({ title: 'Page Ateliers' }),
  },
})
