import { useMemo, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '../../lib/smoothScroll'
import Fil from '../ui/Fil'
import filHero from '../../assets/ateliers/fil-hero.svg?raw'
import flecheUrl from '../../assets/ateliers/fleche.svg?url'
import './AteliersHero.css'

gsap.registerPlugin(useGSAP)

/**
 * Bannière de la page Ateliers, calée sur la maquette (1440×938 sous
 * l'en-tête) : le fil textile descend à gauche depuis le logo, la photo est
 * posée au centre derrière le titre sur une ligne, puis le paragraphe centré
 * et la flèche vers le bas.
 *
 * Animation d'arrivée : « ATELIERS » glisse depuis la gauche et « SUR-MESURE »
 * depuis la droite. Le fil, lui, suit le scroll (composant `Fil`, en scrub).
 * Pas de pin ni de scrub sur le titre. Rien n'est animé en réduction des
 * mouvements.
 */
export default function AteliersHero({ title = '', words = [], text = [], imageSrc }) {
  const scope = useRef(null)

  // Les deux premiers mots du titre sont animés séparément, le reste est
  // simplement affiché après le deuxième.
  const [firstWord, restWords] = useMemo(() => {
    const list = words.filter(Boolean)
    return [list[0] ?? '', list.slice(1)]
  }, [words])

  useGSAP(
    () => {
      const root = scope.current
      if (!root) return undefined

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const first = root.querySelector('.ateliers-hero__word--left')
        const rest = root.querySelector('.ateliers-hero__word--right')

        // Les deux mots arrivent de part et d'autre et se rejoignent au centre.
        const assemble = gsap
          .timeline({ delay: 0.15 })
          .from(
            first,
            { x: () => -window.innerWidth * 0.75, opacity: 0, duration: 1.25, ease: 'expo.out' },
            0,
          )
          .from(
            rest,
            { x: () => window.innerWidth * 0.75, opacity: 0, duration: 1.25, ease: 'expo.out' },
            0.05,
          )

        return () => assemble.kill()
      })

      return () => mm.revert()
    },
    { scope },
  )

  return (
    <section className="ateliers-hero" ref={scope} aria-labelledby="ateliers-title">
      <Fil svg={filHero} className="ateliers-hero__fil" />

      {imageSrc && (
        <figure className="ateliers-hero__figure">
          <img src={imageSrc} alt="" />
        </figure>
      )}

      <h1 className="ateliers-hero__title" id="ateliers-title" aria-label={title}>
        <span className="ateliers-hero__word ateliers-hero__word--left">{firstWord}</span>
        {restWords.length > 0 && (
          <>
            <span className="ateliers-hero__gap">{' '}</span>
            <span className="ateliers-hero__word ateliers-hero__word--right">
              {restWords.join(' ')}
            </span>
          </>
        )}
      </h1>

      <div className="ateliers-hero__text">
        {text.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <img className="ateliers-hero__arrow" src={flecheUrl} alt="" aria-hidden="true" />
    </section>
  )
}
