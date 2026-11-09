import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemas'
import { deskStructure, singletonTypes } from './structure'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET ?? 'production'

export default defineConfig({
  name: 'neotisse',
  title: 'Neotisse — Back office',
  projectId,
  dataset,
  plugins: [structureTool({ structure: deskStructure }), visionTool()],
  schema: {
    types: schemaTypes,
    // Empêche la création de doublons pour les pages uniques.
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  document: {
    // Les singletons ne peuvent pas être dupliqués ni supprimés depuis la liste.
    actions: (actions, { schemaType }) =>
      singletonTypes.has(schemaType)
        ? actions.filter(({ action }) => !['duplicate', 'delete', 'unpublish'].includes(action))
        : actions,
  },
})
