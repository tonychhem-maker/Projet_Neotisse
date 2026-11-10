import { useGSAP } from '@gsap/react'
import { ScrollTrigger, gsap } from './smoothScroll'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * Garde-fou commun aux deux hooks de révélation.
 *
 * ScrollTrigger calcule les positions au chargement, avant que la mise en page
 * soit définitive (accordéon qui se replie, polices, images). Quand une section
 * est épinglée — la hero de l'accueil et de la page Ateliers — tout ce qui suit
 * hérite d'un décalage et certains triggers ne se déclenchent jamais : le
 * contenu resterait invisible. Cette garde révèle d'office tout élément animé
 * qui est réellement dans la fenêtre mais toujours masqué.
 *
 * Retourne une fonction de nettoyage.
 */
function guardVisibleContent(root, selector, reveal) {
  let queued = false

  const check = () => {
    queued = false
    gsap.utils.toArray(selector, root).forEach((el) => {
      const style = getComputedStyle(el)
      const hidden = style.visibility === 'hidden' || style.opacity === '0'
      if (!hidden) return

      const rect = el.getBoundingClientRect()
      const inView = rect.bottom > 0 && rect.top < window.innerHeight
      if (inView) reveal(el)
    })
  }

  const schedule = () => {
    if (queued) return
    queued = true
    requestAnimationFrame(check)
  }

  // Premier passage après le rendu complet, puis à chaque événement qui peut
  // changer la mise en page ou amener un élément dans la fenêtre.
  const rafId = requestAnimationFrame(() => requestAnimationFrame(check))
  ScrollTrigger.addEventListener('refresh', schedule)
  ScrollTrigger.addEventListener('scrollEnd', schedule)
  window.addEventListener('resize', schedule)

  return () => {
    cancelAnimationFrame(rafId)
    ScrollTrigger.removeEventListener('refresh', schedule)
    ScrollTrigger.removeEventListener('scrollEnd', schedule)
    window.removeEventListener('resize', schedule)
  }
}

/**
 * Révélation de texte au scroll — règle unique du site.
 *
 * Principe (validé sur la hero) : rien n'est visible au départ, puis le texte
 * monte depuis un masque quand la section entre dans la fenêtre.
 *
 *   <span class="reveal-line"><span>Ma ligne</span></span>
 *
 * - `.reveal-line` porte `overflow: hidden` (le masque) ;
 * - son enfant direct est la ligne animée : elle part à `yPercent: 105`
 *   (sous le masque) et remonte à 0.
 *
 * Le texte n'est jamais rendu transparent : il reste dans le DOM, lisible par
 * les moteurs de recherche et les lecteurs d'écran, et la sélection de texte
 * fonctionne. Seul le masque le cache physiquement.
 *
 * `prefers-reduced-motion` : rien n'est animé, le texte est affiché d'emblée.
 *
 * Usage :
 *   useTextReveal(scope)                       // toutes les lignes du bloc
 *   useTextReveal(scope, { stagger: 0.08 })    // cascade plus serrée
 */
export function useTextReveal(
  scope,
  { selector = '.reveal-line > *', y = 105, duration = 1.1, stagger = 0.1 } = {},
) {
  useGSAP(
    () => {
      const root = scope?.current
      if (!root) return undefined

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const lines = gsap.utils.toArray(selector, root)
        if (!lines.length) return undefined

        // Regroupement : on anime ensemble les lignes qui partagent le même
        // parent (un paragraphe, un titre…), chacune avec son propre trigger.
        const groups = new Map()
        lines.forEach((line) => {
          const parent = line.parentElement
          if (!groups.has(parent)) groups.set(parent, [])
          groups.get(parent).push(line)
        })

        const triggers = []

        groups.forEach((group, parent) => {
          gsap.set(group, { yPercent: y })

          triggers.push(
            ScrollTrigger.create({
              trigger: parent,
              start: 'top bottom-=12%',
              once: true,
              onEnter: () =>
                gsap.to(group, {
                  yPercent: 0,
                  duration,
                  ease: 'expo.out',
                  stagger,
                  overwrite: true,
                }),
            }),
          )

          // Sécurité : ce qui est déjà visible au chargement s'affiche tout de
          // suite, sans attendre un scroll.
          if (parent.getBoundingClientRect().top < window.innerHeight) {
            gsap.set(group, { yPercent: 0 })
          }
        })

        const stopGuard = guardVisibleContent(root, selector, (el) =>
          gsap.set(el, { yPercent: 0 }),
        )

        return () => {
          triggers.forEach((t) => t.kill())
          stopGuard()
        }
      })

      return () => mm.revert()
    },
    { scope },
  )
}

/**
 * Apparition en fondu + montée, pour les éléments non textuels (images,
 * boutons, logos). Même logique de déclenchement que `useTextReveal`.
 *
 *   <div data-reveal>…</div>
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

          gsap.set(group, { autoAlpha: 0, y })

          triggers.push(
            ScrollTrigger.create({
              trigger: group[0],
              start: 'top bottom-=12%',
              once: true,
              onEnter: () =>
                gsap.to(group, {
                  autoAlpha: 1,
                  y: 0,
                  duration,
                  ease: 'expo.out',
                  stagger: group.length > 1 ? stagger : 0,
                  overwrite: true,
                }),
            }),
          )

          if (group[0].getBoundingClientRect().top < window.innerHeight) {
            gsap.set(group, { autoAlpha: 1, y: 0 })
          }
        })

        const stopGuard = guardVisibleContent(root, '[data-reveal]', (el) =>
          gsap.set(el, { autoAlpha: 1, y: 0 }),
        )

        return () => {
          triggers.forEach((t) => t.kill())
          stopGuard()
        }
      })

      return () => mm.revert()
    },
    { scope },
  )
}
