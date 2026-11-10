import AboutBlock from '../components/sections/AboutBlock'
import ClosingCta from '../components/sections/ClosingCta'
import Hero from '../components/sections/Hero'
import Partners from '../components/sections/Partners'
import WorkshopFormats from '../components/sections/WorkshopFormats'

export default function Ateliers() {
  return (
    <>
      <Hero />

      <AboutBlock
        imageSrc="/assets/images/tissage-fleche.jpg"
        imageAlt="Galons tissés à chevrons présentés dans une vitrine"
      />

      {/* « SUR MESURE » ouverte par défaut, comme sur la maquette. */}
      <WorkshopFormats defaultOpen="04" />

      <Partners />

      <ClosingCta />
    </>
  )
}
