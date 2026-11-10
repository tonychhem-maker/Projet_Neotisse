import { useRef } from 'react'
import { useReveal } from '../../lib/reveal'

// Bloc « Neotisse » : présentation de l'association et visuel d'accroche.
// Repris de la maquette Figma (page Ateliers de médiation).
export default function AboutBlock({ imageSrc, imageAlt }) {
  const scope = useRef(null)

  useReveal(scope, { stagger: 0.14 })

  return (
    <section className="relative" ref={scope}>
      <div className="mx-auto grid w-full max-w-[1230px] grid-cols-1 items-start gap-16 px-10 pb-24 pt-6 lg:grid-cols-[470px_1fr]">
        <div>
          <h2
            data-reveal
            className="font-serif text-[42px] leading-[1.15] text-[#0b4f2a]"
          >
            Neotisse
          </h2>
          <div
            data-reveal-group
            className="mt-10 space-y-14 text-[13px] leading-[2] text-[#0a0a0a]"
          >
            <p data-reveal>
              Fondée en mai 2024 et basée à Montpellier, Neotisse est une association
              loi 1901 dédiée à la médiation scientifique autour des savoir-faire
              textiles anciens, du Néolithique au Moyen Âge.
            </p>
            <p data-reveal>
              Elle conçoit et anime des ateliers démonstratifs et participatifs à
              destination des musées et des structures culturelles, afin de faire
              découvrir au public les techniques textiles du passé et de mettre en
              lumière un patrimoine encore trop souvent méconnu.
            </p>
          </div>
        </div>

        <div data-reveal className="justify-self-end">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="h-[262px] w-[460px] max-w-full object-cover"
          />
        </div>
      </div>
    </section>
  )
}
