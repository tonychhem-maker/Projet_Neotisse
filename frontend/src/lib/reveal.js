import { useGSAP } from '@gsap/react'
import { ScrollTrigger, gsap } from './smoothScroll'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * Apparition douce des sections au scroll.
 *
 * - Chaque élément `[data-reveal]` apparaît en fondu (+ montée de `y` px) dès
 *   qu'il entre dans la fenêtre.
 * - Les enfants `[data-reveal]` d'un conteneur `[data-reveal-group]`
 *   apparaissent en cascade, déclenchés par le conteneur.
 *
 * Robustesse : dès le premier calcul, tout élément situé dans la fenêtre (ou
 * au-dessus) est affiché immédiatement — un élément ne peut jamais rester
 * invisible parce qu'on a rechargé la page en milieu de section.
 *
 * Le style est posé via `gsap.from`, donc aucun état résiduel : si le trigger
 * est recréé, l'animation repart toujours d'un point connu.
 *
 * `prefers-reduced-motion` : aucune animation, contenu visible.
 */
export function useReveal(scope, { stagger = 0.12, y = 28, duration = 0.9 } = {}) {
  useGSAP(
    () => {
      const root = scope?.current
      if (!root) return undefined

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const isGroupChild = (el) => !!el.parentElement?.closest('[data-reveal-group]')

        const surfaces = [
          ...gsap.utils.toArray('[data-reveal-group]', root),
          ...gsap.utils.toArray('[data-reveal]', root).filter(
            (el) => !isGroupChild(el) && !el.hasAttribute('data-reveal-group'),
          ),
        ]

        const triggers = []

        surfaces.forEach((surface) => {
          const isGroup = surface.hasAttribute('data-reveal-group')
          const group = isGroup ? gsap.utils.toArray('[data-reveal]', surface) : [surface]
          if (!group.length) return

          const play = () =>
            gsap.fromTo(
              group,
              { autoAlpha: 0, y },
              {
                autoAlpha: 1,
                y: 0,
                duration,
                ease: 'expo.out',
                stagger: group.length > 1 ? stagger : 0,
                overwrite: true,
              },
            )

          triggers.push(
            ScrollTrigger.create({
              trigger: group[0],
              start: 'top bottom-=10%',
              once: true,
              onEnter: play,
            }),
          )

          // Sécurité : tout ce qui est déjà à l'écran au chargement (ou au-dessus)
          // est révélé instantanément, sans attendre un scroll.
          if (group[0].getBoundingClientRect().top < window.innerHeight) {
            gsap.set(group, { autoAlpha: 1, y: 0 })
          }
        })

        // Après le recalcul des positions (Lenis, images, polices) : on vérifie
        // qu'aucun bloc visible n'est resté masqué.
        ScrollTrigger.refresh()

        return () => {
          triggers.forEach((t) => t.kill())
        }
      })

      return () => mm.revert()
    },
    { scope },
  )
}

/**
 * Parallaxe d'un visuel `[data-parallax]` : il glisse de `strength` % pendant
 * que son bloc traverse l'écran. Réservé aux visuels isolés, l'effet étant
 * scrubbé au scroll (et donc lent par nature).
 */
export function useParallax(scope, { strength = 8 } = {}) {
  useGSAP(
    () => {
      const root = scope?.current
      if (!root) return undefined

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const targets = gsap.utils.toArray('[data-parallax]', root)

        const triggers = targets.map((el) =>
          gsap.fromTo(
            el,
            { yPercent: -strength },
            {
              yPercent: strength,
              ease: 'none',
              immediateRender: false,
              scrollTrigger: {
                trigger: el.parentElement ?? el,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            },
          ),
        )

        return () => {
          triggers.forEach((t) => {
            t.scrollTrigger?.kill()
            t.kill()
          })
        }
      })

      return () => mm.revert()
    },
    { scope },
  )
}
