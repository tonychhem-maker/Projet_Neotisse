import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger, gsap } from '../../lib/smoothScroll'
import { HERO_IMAGES, HERO_TITLE, HERO_TITLE_LINES } from '../../data/home'
import './Hero.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const FINAL_ROT = [6, -7, -5, 7] // rotation finale de chaque carte
const START_ROT = [-4, 3, -15, -3] // rotation au moment où la carte entre
const CARD_CLASSES = ['c1', 'c2', 'c3', 'c4']

// Départ de l'animation du titre : chaque mot sort de sous son masque.
const LINE_FROM = { yPercent: 105, rotate: 4 }
const LINE_TO = { yPercent: 0, rotate: 0 }
const WORD_FROM = { yPercent: 110, opacity: 0 }
const WORD_TO = { yPercent: 0, opacity: 1 }

const THREAD_PATH =
  'M0,470 L52,470 C118,468 126,420 116,372 C104,310 72,272 70,248 C96,282 138,276 126,226 ' +
  'C112,160 232,208 282,192 C372,166 470,110 574,44 C640,2 700,-6 724,24 C742,60 746,96 784,128 ' +
  'C840,160 910,110 944,76 C990,46 1040,150 1064,182 C1110,214 1140,250 1128,308 ' +
  'C1122,340 1200,376 1262,404'

/**
 * Découpe une ligne en mots, chacun dans son propre masque.
 *
 *   « Ateliers de » → [{ Ateliers }, espaces, { de }]
 *
 * Le titre reste un seul h1 et chaque mot garde l'espace qui le suit : le texte
 * lu par les lecteurs d'écran et les moteurs de recherche ne change pas.
 */
function splitWords(line) {
  return line
    .split(/(\s+)/)
    .filter((chunk) => chunk.length > 0)
    .map((chunk, i) => ({ text: chunk, isSpace: /^\s+$/.test(chunk), key: `${i}-${chunk}` }))
}

/**
 * Hero de l'accueil et de la page Ateliers.
 *
 * Au chargement, seuls la navbar et le fond sont visibles, avec l'indication
 * « Scrolle ». La section est épinglée et le mouvement suit le scroll (scrub),
 * donc réversible :
 * 1. les cartes photo tombent du haut, une par une, en fondu ;
 * 2. le fil se dessine pendant toute la chute ;
 * 3. le titre se révèle mot par mot depuis son masque, en `expo.out` ;
 * 4. « Scrolle » disparaît dès les premiers pixels ;
 * 5. une fois les cartes posées, la hero se libère.
 *
 * `title` vient du back-office : il est découpé en lignes, puis en mots, pour
 * la révélation.
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

  // Le titre est construit séparément (voir plus bas) : son animation est
  // rebranchée à chaque nouveau contenu, sans toucher au pin de la hero.
  const revealRef = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      // Aucune animation si l'utilisateur demande de réduire les mouvements :
      // les cartes et le fil restent dans leur état final, le titre dans son
      // masque (`.ln`), c'est-à-dire entièrement lisible.
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const cards = gsap.utils.toArray('.card', root.current)
        const len = thread.current.getTotalLength()

        gsap.set(thread.current, { strokeDasharray: len, strokeDashoffset: len })

        let shown = false

        const tl = gsap.timeline({
          scrollTrigger: {
            id: 'hero-pin',
            trigger: root.current,
            // La hero est fixée sous la navbar pendant toute la chute des
            // cartes. `pinType: 'fixed'` évite la transformation d'ancêtre du
            // mode `transform` (défaut) quand la page est lissée par Lenis.
            start: 'top 72px',
            end: '+=220%',
            pin: root.current,
            pinType: 'fixed',
            anticipatePin: 1,
            // L'espace de défilement du pin est réservé dès le premier calcul :
            // sans cela, la hauteur de la page change en plein scroll (la
            // section se met à « flotter ») et le contenu saute.
            pinSpacing: true,
            scrub: 0.7,
            invalidateOnRefresh: true, // recalcule les valeurs en fonction de la hauteur d'écran
            onUpdate: (self) => {
              const show = self.progress > 0.45 // titre : quand les cartes sont à moitié tombées
              if (show === shown) return
              shown = show

              const reveal = revealRef.current
              if (!reveal) return
              if (show) reveal.play()
              else reveal.reverse()
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
          root.current?.classList.remove('is-animated')
          tl.kill()
        }
      })

      return () => mm.revert()
    },
    { scope: root }, // tous les sélecteurs sont limités à ce composant
  )

  // Animation du titre seule.
  //
  // `lines` vient du back-office : le contenu de repli s'affiche d'abord, puis
  // les vraies lignes arrivent et React remplace les nœuds du titre. On
  // rebranche donc l'animation à chaque nouveau contenu, sans rejouer le pin.
  useGSAP(
    () => {
      const scope = root.current
      if (!scope) return undefined

      const revealLines = gsap.utils.toArray('.title .ln', scope)
      const revealWords = gsap.utils.toArray('.title .w-inner', scope)
      if (!revealLines.length) return undefined

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Les masques de mots ne servent qu'à l'animation : le CSS laisse le
        // titre visible si ce code ne s'exécute pas.
        scope.classList.add('is-animated')

        // État de départ posé explicitement : une timeline en pause n'applique
        // pas toujours ses `fromTo` à toutes les cibles avant la première lecture.
        gsap.set(revealLines, LINE_FROM)
        gsap.set(revealWords, WORD_FROM)

        const reveal = gsap
          .timeline({ paused: true })
          .to(revealLines, {
            ...LINE_TO,
            duration: 1.2,
            ease: 'expo.out',
            stagger: 0.12,
          })
          .to(
            revealWords,
            {
              ...WORD_TO,
              duration: 0.9,
              ease: 'expo.out',
              stagger: 0.045,
            },
            0.05,
          )

        revealRef.current = reveal

        // Si le visiteur arrive déjà loin dans la page (rechargement au milieu,
        // retour depuis une autre page), la timeline doit refléter la position.
        const st = ScrollTrigger.getById?.('hero-pin')
        if (st && st.progress > 0.45) reveal.progress(1)

        return () => {
          revealRef.current = null
          reveal.kill()
          scope.classList.remove('is-animated')
        }
      })

      return () => {
        revealRef.current = null
        mm.revert()
      }
    },
    { scope: root, dependencies: [lines] },
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
            <span className="ln-inner">
              {splitWords(line).map((word) =>
                word.isSpace ? (
                  word.text
                ) : (
                  <span className="w" key={word.key}>
                    <span className="w-inner">{word.text}</span>
                  </span>
                ),
              )}
            </span>
          </span>
        ))}
      </h1>

      <div className="hint" ref={hintRef}>
        {hint}
      </div>
    </section>
  )
}
