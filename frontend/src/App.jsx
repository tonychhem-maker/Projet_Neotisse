import { Route, Routes } from 'react-router-dom'
import Footer from './components/layout/Footer'
import Header from './components/layout/Header'
import { ScrollToTop } from './components/layout/ScrollToTop'
import APropos from './pages/APropos'
import Actualites from './pages/Actualites'
import Ateliers from './pages/Ateliers'
import Contact from './pages/Contact'
import Deplacements from './pages/Deplacements'
import Home from './pages/Home'
import LaisserUnMot from './pages/LaisserUnMot'
import LivreDor from './pages/LivreDor'
import MentionsLegales from './pages/legal/MentionsLegales'
import NotFound from './pages/NotFound'
import Partenaires from './pages/Partenaires'
import PolitiqueCookies from './pages/legal/PolitiqueCookies'
import PolitiqueConfidentialite from './pages/legal/PolitiqueConfidentialite'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ateliers-de-mediation-textile" element={<Ateliers />} />
          <Route path="/a-propos" element={<APropos />} />
          <Route path="/actualites" element={<Actualites />} />
          <Route path="/deplacements" element={<Deplacements />} />
          <Route path="/partenaires" element={<Partenaires />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/livre-d-or" element={<LivreDor />} />
          <Route path="/livre-d-or/laisser-un-mot" element={<LaisserUnMot />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/politique-de-confidentialite" element={<PolitiqueConfidentialite />} />
          <Route path="/politique-de-cookies" element={<PolitiqueCookies />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
