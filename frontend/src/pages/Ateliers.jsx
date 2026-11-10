import AboutBlock from '../components/sections/AboutBlock'
import ClosingCta from '../components/sections/ClosingCta'
import Hero from '../components/sections/Hero'
import Partners from '../components/sections/Partners'
import WorkshopFormats from '../components/sections/WorkshopFormats'
import { ABOUT_FALLBACK, CTA_FALLBACK, FORMATS_FALLBACK, PARTNERS_FALLBACK } from '../data/home'

// Page Ateliers : la même composition que l'accueil, mais le format « Sur
// mesure » est ouvert par défaut, comme sur la maquette.
export default function Ateliers() {
  return (
    <>
      <Hero />

      <AboutBlock
        title={ABOUT_FALLBACK.title}
        paragraphs={ABOUT_FALLBACK.paragraphs}
        imageSrc={ABOUT_FALLBACK.imageSrc}
        imageAlt={ABOUT_FALLBACK.imageAlt}
      />

      <WorkshopFormats formats={FORMATS_FALLBACK} defaultOpen="04" />

      <Partners {...PARTNERS_FALLBACK} />

      <ClosingCta {...CTA_FALLBACK} />
    </>
  )
}
