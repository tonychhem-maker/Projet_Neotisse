import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rolldownOptions: {
      output: {
        // Sépare les librairies lourdes pour profiter du cache navigateur.
        codeSplitting: {
          groups: [
            { name: 'vendor-gsap', test: /node_modules[\\/](gsap|lenis)[\\/]/ },
            { name: 'vendor-sanity', test: /node_modules[\\/]@sanity[\\/]/ },
            { name: 'vendor-react', test: /node_modules[\\/](react|react-dom|react-router)[\\/]/ },
          ],
        },
      },
    },
  },
})
