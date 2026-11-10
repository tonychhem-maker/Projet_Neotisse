import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Recalcule les positions de tous les triggers une fois la mise en page prête.
 *
 * La hero (accueil, page Ateliers) est épinglée sur 220 % de la hauteur
 * d'écran et la mise en page bouge encore au chargement (accordéon qui se
 * replie, polices, images). Les positions calculées par ScrollTrigger à ce
 * moment-là sont donc périmées : on les recalcule quand tout est stable.
 *
 * Le recalcul se fait en haut de page : ScrollTrigger mesure les positions par
 * rapport au défilement et une mesure prise en cours de défilement fausse le
 * résultat. La position est restaurée juste après.
 */
function refreshAtTop() {
  const y = window.scrollY
  if (y) window.scrollTo(0, 0)

  ScrollTrigger.refresh()

  if (y) window.scrollTo(0, y)
}

/**
 * Défilement fluide (Lenis) synchronisé avec GSAP ScrollTrigger.
 *
 * - Si l'utilisateur a activé « réduire les animations », Lenis n'est pas
 *   instancié : le défilement natif est conservé (le recalcul des positions,
 *   lui, reste nécessaire à cause de la hero épinglée).
 * - Lenis pilote ScrollTrigger via `scrollerProxy` + `ScrollTrigger.update`
 *   à chaque frame, ce qui garde les animations parfaitement synchronisées.
 */
export function useSmoothScroll() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    // La hero est épinglée : ses positions de référence ne sont justes qu'après
    // le premier calcul complet. Sans ce refresh, tout ce qui suit la hero
    // (sections, pied de page) hérite d'un décalage d'une hauteur d'écran et
    // reste bloqué à son état initial (invisible).
    refreshAtTop()

    // Les polices d'affichage (Boldonse, Anton) changent la hauteur du titre et
    // donc la position de tout ce qui suit la hero : un seul second calcul, une
    // fois qu'elles sont chargées.
    document.fonts?.ready.then(() => {
      if (document.fonts.status === 'loaded') refreshAtTop()
    })

    if (prefersReducedMotion) return undefined

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenis.on('scroll', ScrollTrigger.update)

    const raf = (time) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
    }
  }, [])
}

export { gsap, ScrollTrigger }
