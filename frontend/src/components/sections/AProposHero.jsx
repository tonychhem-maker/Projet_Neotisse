import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '../../lib/smoothScroll'
import Fil from '../ui/Fil'
import filDroite from '../../assets/apropos/fil-droite.svg?raw'
import filGauche from '../../assets/apropos/fil-gauche.svg?raw'
import logoUrl from '../../assets/apropos/logo-apropos.png'
import flecheUrl from '../../assets/apropos/fleche.svg?url'
import './AProposHero.css'

gsap.registerPlugin(useGSAP)

/**
 * Bannière de la page À propos, calée sur la maquette (frame « A propos »
 * 424:445, de y80 à y890) : titre centré sur deux lignes, logo tampon au
 * centre, paragraphe d'accroche puis flèche vers le bas.
 *
 * Animation d'arrivée : la première ligne du titre glisse depuis la gauche et
 * la seconde depuis la droite, elles se rejoignent au centre (même langage
 * que la bannière de la page Ateliers). Pas de pin ni de scrub. Rien n'est
 * animé en réduction des mouvements.
 *
 * Deux fils textile décorent la bannière : l'un part du bord droit derrière
 * l'en-tête, l'autre longe le bord gauche et passe derrière la grande image
 * de la section suivante. Leurs tracés se dessinent à l'arrivée (composant
 * `Fil`) ; sans JavaScript ni en réduction des mouvements, ils sont
 * entièrement tracés.
 */
export default function AProposHero({ title = '', text = [] }) {
  const scope = useRef(null)
  const lines = String(title).split(/\r?\n/).filter(Boolean)

  useGSAP(
    () => {
      const root = scope.current
      if (!root) return undefined

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const spans = root.querySelectorAll('.a-propos-hero__line')

        // Les lignes arrivent de part et d'autre et se rejoignent au centre :
        // la première depuis la gauche, la seconde depuis la droite, etc.
        const assemble = gsap
          .timeline({ delay: 0.15 })
          .from(
            spans,
            {
              x: (index) => (index % 2 === 0 ? -1 : 1) * window.innerWidth * 0.75,
              opacity: 0,
              duration: 1.25,
              ease: 'expo.out',
              stagger: 0.06,
            },
            0,
          )

        return () => assemble.kill()
      })

      return () => mm.revert()
    },
    { scope },
  )

  return (
    <section className="a-propos-hero" ref={scope} aria-labelledby="a-propos-title">
      <Fil svg={filDroite} className="a-propos-hero__fil a-propos-hero__fil--droite" />
      <Fil svg={filGauche} className="a-propos-hero__fil a-propos-hero__fil--gauche" />

      <h1 className="a-propos-hero__title" id="a-propos-title">
        {lines.map((line, index) => (
          <span className="a-propos-hero__line" key={`${line}-${index}`}>
            {line}
          </span>
        ))}
      </h1>

      <img
        className="a-propos-hero__logo"
        src={logoUrl}
        alt=""
        aria-hidden="true"
        loading="eager"
      />

      <div className="a-propos-hero__text">
        {text.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <img className="a-propos-hero__arrow" src={flecheUrl} alt="" aria-hidden="true" />
    </section>
  )
}
