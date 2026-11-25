import { defineCliConfig } from 'sanity/cli'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET ?? 'production'

export default defineCliConfig({
  api: { projectId, dataset },
  deployment: {
    appId: process.env.SANITY_STUDIO_APP_ID || 'ljt6pcepqr5ki3x62sm72qt6',
  },
})
