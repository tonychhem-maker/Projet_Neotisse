import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger, gsap } from '../../lib/smoothScroll'
import { HERO_IMAGES, HERO_TITLE, HERO_TITLE_LINES } from '../../data/home'
import './Hero.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const FINAL_ROT = [6, -7, -5, 7] // rotation finale de chaque carte
const START_ROT = [-4, 3, -15, -3] // rotation au moment où la carte entre
const CARD_CLASSES = ['c1', 'c2', 'c3', 'c4']

const THREAD_PATH =
  'M0,470 L52,470 C118,468 126,420 116,372 C104,310 72,272 70,248 C96,282 138,276 126,226 ' +
  'C112,160 232,208 282,192 C372,166 470,110 574,44 C640,2 700,-6 724,24 C742,60 746,96 784,128 ' +
  'C840,160 910,110 944,76 C990,46 1040,150 1064,182 C1110,214 1140,250 1128,308 ' +
  'C1122,340 1200,376 1262,404'

/**
 * Hero de l'accueil et de la page Ateliers.
 *
 * Au chargement, seuls la navbar et le fond sont visibles, avec l'indication
 * « Scrolle ». La section est épinglée et le mouvement suit le scroll (scrub),
 * donc réversible :
 * 1. les cartes photo tombent du haut, une par une, en fondu ;
 * 2. le fil se dessine pendant toute la chute ;
 * 3. le titre se révèle ligne par ligne depuis un masque, en `expo.out` ;
 * 4. « Scrolle » disparaît dès les premiers pixels ;
 * 5. une fois les cartes posées, la hero se libère.
 *
 * `title` vient du back-office : il est découpé en lignes pour la révélation.
 */
export default function Hero({
  images = HERO_IMAGES,
  lines = HERO_TITLE_LINES,
  title = HERO_TITLE,
  hint = 'Scrolle',
}) {
  const root = useRef(null)
  const thread = useRef(null)
  const hintRef = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      // Aucune animation si l'utilisateur demande de réduire les mouvements
      // (le CSS affiche alors directement l'état final)
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const cards = gsap.utils.toArray('.card', root.current)
        const len = thread.current.getTotalLength()

        gsap.set(thread.current, { strokeDasharray: len, strokeDashoffset: len })

        // Le titre : timeline déclenchée (pas scrubée), révélation ligne par ligne
        const reveal = gsap.timeline({ paused: true }).fromTo(
          '.title .ln > span',
          { yPercent: 105, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1.1, ease: 'expo.out', stagger: 0.1 },
        )

        let shown = false

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: 'top 72px', // hauteur de la navbar sticky : la hero se fige sous elle
            end: '+=220%',
            pin: true,
            scrub: 0.7,
            invalidateOnRefresh: true, // recalcule les valeurs en fonction de la hauteur d'écran
            onUpdate: (self) => {
              const show = self.progress > 0.45 // titre : quand les cartes sont à moitié tombées
              if (show !== shown) {
                shown = show
                if (show) reveal.play()
                else reveal.reverse()
              }
            },
          },
        })

        // 1. Les cartes tombent une par une (décélération douce, sans rebond)
        tl.from(cards, {
          y: () => -window.innerHeight * 1.3,
          rotation: (i) => START_ROT[i],
          opacity: 0,
          ease: 'power3.out',
          duration: 1,
          stagger: 0.2,
        })

        // 2. Le fil se dessine pendant toute la chute (1 + 3 × 0.2 = 1.6)
        tl.fromTo(
          thread.current,
          { strokeDashoffset: len },
          { strokeDashoffset: 0, ease: 'none', duration: 1.6 },
          0,
        )

        // 3. L'indication « Scrolle » disparaît dès les premiers pixels
        tl.to(hintRef.current, { opacity: 0, ease: 'none', duration: 0.08 }, 0)

        return () => {
          reveal.kill()
          tl.kill()
        }
      })

      return () => mm.revert()
    },
    { scope: root }, // tous les sélecteurs sont limités à ce composant
  )

  return (
    <section className="hero" ref={root}>
      <svg
        className="hero-svg"
        viewBox="0 0 1440 1024"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <path
          ref={thread}
          className="thread"
          d={THREAD_PATH}
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {CARD_CLASSES.map((cls, i) => (
        <div
          key={cls}
          className={`card ${cls}`}
          style={{ '--r': `${FINAL_ROT[i]}deg` }}
        >
          <img src={images[i]} alt="" />
        </div>
      ))}

      <h1 className="title" aria-label={title}>
        {lines.map((line) => (
          <span className="ln" key={line} aria-hidden="true">
            <span>{line}</span>
          </span>
        ))}
      </h1>

      <div className="hint" ref={hintRef}>
        {hint}
      </div>
    </section>
  )
}
