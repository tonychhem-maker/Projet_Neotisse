import { defineField, defineType } from 'sanity'

/**
 * Seuils du plan de taggage, modifiables par l'équipe sans toucher au code.
 *
 * Pour chaque KPI : en dessous du seuil négatif, la situation demande une
 * action ; au-dessus du seuil positif, c'est un point fort à préserver. Entre
 * les deux, l'objectif est atteint. Les valeurs sont évaluées sur 30 jours.
 */
export const analyticsTargets = defineType({
  name: 'analyticsTargets',
  title: 'Objectifs statistiques',
  type: 'document',
  fields: [
    defineField({
      name: 'quoteLeads',
      title: 'Demandes de devis (formulaire de contact)',
      type: 'object',
      description: 'Nombre de messages envoyés sur 30 jours.',
      fields: [
        defineField({ name: 'low', title: 'Seuil négatif (en dessous : à améliorer)', type: 'number', initialValue: 3, validation: rule => rule.required().min(0) }),
        defineField({ name: 'high', title: 'Seuil positif (au-dessus : point fort)', type: 'number', initialValue: 6, validation: rule => rule.required().min(0) }),
      ],
      validation: rule => rule.custom(value => (value && value.low !== undefined && value.high !== undefined && value.high < value.low)
        ? 'Le seuil positif doit être supérieur ou égal au seuil négatif.'
        : true),
    }),
    defineField({
      name: 'googleShare',
      title: 'Référencement (part des visites venant de Google)',
      type: 'object',
      description: 'Pourcentage des visites sur 30 jours. Remplace la « position Google », non mesurable sans Search Console.',
      fields: [
        defineField({ name: 'low', title: 'Seuil négatif (%)', type: 'number', initialValue: 25, validation: rule => rule.required().min(0).max(100) }),
        defineField({ name: 'high', title: 'Seuil positif (%)', type: 'number', initialValue: 40, validation: rule => rule.required().min(0).max(100) }),
      ],
      validation: rule => rule.custom(value => (value && value.low !== undefined && value.high !== undefined && value.high < value.low)
        ? 'Le seuil positif doit être supérieur ou égal au seuil négatif.'
        : true),
    }),
    defineField({
      name: 'testimonials',
      title: 'Avis reçus (livre d’or)',
      type: 'object',
      description: 'Nombre de messages reçus sur 30 jours, avant modération.',
      fields: [
        defineField({ name: 'low', title: 'Seuil négatif', type: 'number', initialValue: 2, validation: rule => rule.required().min(0) }),
        defineField({ name: 'high', title: 'Seuil positif', type: 'number', initialValue: 4, validation: rule => rule.required().min(0) }),
      ],
      validation: rule => rule.custom(value => (value && value.low !== undefined && value.high !== undefined && value.high < value.low)
        ? 'Le seuil positif doit être supérieur ou égal au seuil négatif.'
        : true),
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Objectifs statistiques' }),
  },
})
