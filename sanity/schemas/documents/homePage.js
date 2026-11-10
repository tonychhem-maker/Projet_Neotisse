import { defineArrayMember, defineField, defineType } from 'sanity'

export const homePage = defineType({
  name: 'homePage',
  title: "Page d'accueil",
  type: 'document',
  groups: [
    { name: 'hero', title: 'Bannière', default: true },
    { name: 'intro', title: 'Présentation' },
    { name: 'workshops', title: 'Ateliers' },
    { name: 'formats', title: 'Formats d’atelier' },
    { name: 'availability', title: 'Disponibilités' },
    { name: 'seo', title: 'Référencement' },
  ],
  fields: [
    defineField({
      name: 'heroTitle',
      title: 'Titre principal',
      type: 'string',
      group: 'hero',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroText',
      title: 'Texte de la bannière',
      type: 'text',
      rows: 3,
      group: 'hero',
      validation: (rule) => rule.required(),
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
      name: 'heroCta',
      title: 'Bouton principal',
      type: 'link',
      group: 'hero',
    }),

    defineField({
      name: 'introTitle',
      title: 'Titre de la présentation',
      type: 'string',
      group: 'intro',
    }),
    defineField({
      name: 'introText',
      title: 'Texte de présentation',
      type: 'richText',
      group: 'intro',
    }),

    defineField({
      name: 'workshopsTitle',
      title: 'Titre de la section ateliers',
      type: 'string',
      group: 'workshops',
      initialValue: 'Nos ateliers',
    }),
    defineField({
      name: 'featuredWorkshops',
      title: 'Ateliers mis en avant',
      type: 'array',
      group: 'workshops',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'workshop' }] })],
      validation: (rule) => rule.max(3).warning('La page affiche au mieux 3 ateliers.'),
    }),

    defineField({
      name: 'formatsTitle',
      title: 'Titre de la section formats',
      type: 'string',
      group: 'formats',
      initialValue: 'Nos formats',
    }),
    defineField({
      name: 'formatsIntro',
      title: 'Texte de la section formats',
      type: 'text',
      rows: 2,
      group: 'formats',
    }),
    defineField({
      name: 'featuredFormats',
      title: 'Formats affichés sur la page d’accueil',
      type: 'array',
      group: 'formats',
      description:
        'Sélectionnez et ordonnez les formats à afficher. Laissez vide pour afficher tous les formats visibles, dans leur ordre propre.',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'workshopFormat' }] })],
    }),
    defineField({
      name: 'formatsCtaTitle',
      title: 'Titre du bloc final de la section formats',
      type: 'string',
      group: 'formats',
      description: 'Ex : « Partons de votre projet ensemble »',
    }),
    defineField({
      name: 'formatsCtaText',
      title: 'Texte du bloc final',
      type: 'text',
      rows: 3,
      group: 'formats',
    }),
    defineField({
      name: 'formatsCtaLink',
      title: 'Lien du bloc final',
      type: 'link',
      group: 'formats',
    }),
    defineField({
      name: 'formatsCtaImage',
      title: 'Image du bloc final',
      type: 'image',
      group: 'formats',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Texte alternatif', type: 'string' })],
    }),

    defineField({
      name: 'availabilityTitle',
      title: 'Titre de la section disponibilités',
      type: 'string',
      group: 'availability',
      initialValue: 'Disponibilités',
    }),
    defineField({
      name: 'availabilityText',
      title: 'Texte des disponibilités',
      type: 'text',
      rows: 3,
      group: 'availability',
    }),
    defineField({
      name: 'availabilityCta',
      title: 'Bouton de la section disponibilités',
      type: 'link',
      group: 'availability',
    }),

    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  preview: {
    prepare: () => ({ title: "Page d'accueil" }),
  },
})
