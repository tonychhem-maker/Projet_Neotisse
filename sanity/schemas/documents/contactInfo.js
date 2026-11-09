import { defineField, defineType } from 'sanity'

export const contactInfo = defineType({
  name: 'contactInfo',
  title: 'Page Contact',
  type: 'document',
  groups: [
    { name: 'content', title: 'Contenu', default: true },
    { name: 'form', title: 'Formulaire' },
    { name: 'seo', title: 'Référencement' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      group: 'content',
      initialValue: 'Contactez-nous',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Introduction',
      type: 'text',
      rows: 3,
      group: 'content',
    }),
    defineField({ name: 'email', title: 'E-mail affiché', type: 'string', group: 'content' }),
    defineField({ name: 'phone', title: 'Téléphone affiché', type: 'string', group: 'content' }),
    defineField({
      name: 'address',
      title: 'Adresse affichée',
      type: 'text',
      rows: 3,
      group: 'content',
    }),
    defineField({
      name: 'formEndpoint',
      title: 'Endpoint du formulaire (Formspree)',
      type: 'url',
      group: 'form',
      description:
        "URL fournie par Formspree, du type https://formspree.io/f/xxxxxxx. Laisser vide pour utiliser la variable d'environnement VITE_CONTACT_FORM_ENDPOINT.",
    }),
    defineField({
      name: 'formSuccessMessage',
      title: 'Message de confirmation',
      type: 'string',
      group: 'form',
      initialValue: 'Merci ! Votre message a bien été envoyé, nous vous répondrons rapidement.',
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  preview: {
    prepare: () => ({ title: 'Page Contact' }),
  },
})
