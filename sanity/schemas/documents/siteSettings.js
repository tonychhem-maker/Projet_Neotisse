import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Réglages du site',
  type: 'document',
  groups: [
    { name: 'identity', title: 'Identité', default: true },
    { name: 'contact', title: 'Contact' },
    { name: 'social', title: 'Réseaux sociaux' },
    { name: 'seo', title: 'Référencement' },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Nom du site',
      type: 'string',
      group: 'identity',
      initialValue: 'Neotisse',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'baseline',
      title: "Phrase d'accroche (pied de page)",
      type: 'string',
      group: 'identity',
      initialValue:
        'Ateliers de médiation textile autour du tissage, du néolithique au Moyen Âge.',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      group: 'identity',
      options: { hotspot: true },
    }),
    defineField({
      name: 'email',
      title: 'Adresse e-mail',
      type: 'string',
      group: 'contact',
      validation: (rule) => rule.email(),
    }),
    defineField({ name: 'phone', title: 'Téléphone', type: 'string', group: 'contact' }),
    defineField({
      name: 'address',
      title: 'Adresse postale',
      type: 'text',
      rows: 3,
      group: 'contact',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Réseaux sociaux',
      type: 'array',
      group: 'social',
      of: [{ type: 'link' }],
    }),
    defineField({ name: 'seo', title: 'SEO par défaut', type: 'seo', group: 'seo' }),
  ],
  preview: {
    prepare: () => ({ title: 'Réglages du site' }),
  },
})
