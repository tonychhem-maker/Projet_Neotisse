import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { useSmoothScroll } from './lib/smoothScroll'

// Le défilement fluide est monté au niveau racine : il pilote le même ticker
// GSAP que les animations ScrollTrigger des pages.
function Root() {
  useSmoothScroll()

  return <App />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Root />
    </BrowserRouter>
  </StrictMode>,
)
