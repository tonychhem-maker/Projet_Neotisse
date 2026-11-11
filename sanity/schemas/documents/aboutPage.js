import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * Page « À propos ».
 *
 * Le contenu éditorial (bannière, grande image, histoire, équipe, lien final)
 * vit ici. La liste des membres est composée à partir des documents
 * `teamMember` existants : une même fiche alimente cette page sans double
 * saisie.
 */
export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'Page À propos',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Bannière', default: true },
    { name: 'banner', title: 'Grande image' },
    { name: 'histoire', title: 'Histoire' },
    { name: 'equipe', title: 'Équipe' },
    { name: 'seo', title: 'Référencement' },
  ],
  fields: [
    defineField({
      name: 'heroTitle',
      title: 'Titre principal',
      type: 'string',
      group: 'hero',
      initialValue: 'Ateliers de médiations\nsur le tissage pour tous',
      description:
        'Affiché en très grand, centré. Un retour à la ligne crée une nouvelle ligne.',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'heroText',
      title: 'Texte de la bannière',
      type: 'text',
      rows: 3,
      group: 'hero',
      description: 'Chaque retour à la ligne crée un paragraphe. Le texte est centré sous le logo.',
    }),

    defineField({
      name: 'bannerImage',
      title: 'Grande image',
      type: 'image',
      group: 'banner',
      options: { hotspot: true },
      description: 'Photo pleine largeur affichée sous la bannière.',
      fields: [defineField({ name: 'alt', title: 'Texte alternatif', type: 'string' })],
    }),
    defineField({
      name: 'bannerTitle',
      title: 'Mot sur la grande image',
      type: 'string',
      group: 'banner',
      initialValue: 'Neotisse',
      description: 'Mot décoratif affiché en blanc par-dessus la grande image.',
    }),

    defineField({
      name: 'histoireTitle',
      title: 'Titre de l’histoire',
      type: 'string',
      group: 'histoire',
      initialValue: 'L’histoire de l’association',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'histoireText',
      title: 'Texte de l’histoire',
      type: 'text',
      rows: 6,
      group: 'histoire',
    }),
    defineField({
      name: 'histoireImage',
      title: 'Photo de l’histoire',
      type: 'image',
      group: 'histoire',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Texte alternatif', type: 'string' })],
    }),

    defineField({
      name: 'members',
      title: 'Membres affichés',
      type: 'array',
      group: 'equipe',
      description:
        'Sélectionnez et ordonnez les membres de l’équipe. Chacun affiche sa photo, son nom, sa fonction et sa biographie.',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'teamMember' }] })],
    }),
    defineField({
      name: 'moreLink',
      title: 'Lien « voir plus »',
      type: 'link',
      group: 'equipe',
      description: 'Lien affiché sous la liste des membres (ex. vers la page contact).',
    }),

    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  preview: {
    prepare: () => ({ title: 'Page À propos' }),
  },
})
