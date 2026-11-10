import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Recalcule les positions de tous les triggers une fois la mise en page prête.
 *
 * Seule la hero (accueil, page Ateliers) est épinglée, sur 220 % de la hauteur
 * d'écran. La mise en page bouge encore au chargement (accordéon qui se
 * replie, polices, images, contenu Sanity) : les positions calculées par
 * ScrollTrigger peuvent donc être périmées et le pin décalé.
 *
 * ScrollTrigger mesure les positions par rapport au défilement, mais son
 * `refresh()` sait se débrouiller quel que soit le point de défilement. On ne
 * déplace donc plus la page : un `scrollTo(0, 0)` suivi d'un retour déclenche
 * le défilement natif « smooth » et se retrouve en concurrence avec Lenis,
 * d'où des sauts et une page qui ne suit plus le geste.
 */
function refreshAtTop() {
  ScrollTrigger.refresh()
}

/**
 * Défilement fluide (Lenis) synchronisé avec GSAP ScrollTrigger.
 *
 * - Si l'utilisateur a activé « réduire les animations », Lenis n'est pas
 *   instancié : le défilement natif est conservé (le recalcul des positions,
 *   lui, reste nécessaire à cause de la hero épinglée).
 * - Lenis pilote ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)`
 *   à chaque frame, ce qui garde les animations parfaitement synchronisées.
 */
export function useSmoothScroll() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    // Les polices d'affichage (Boldonse, Anton) changent la hauteur du titre et
    // donc la position de tout ce qui suit la hero : un second calcul une fois
    // qu'elles sont chargées.
    document.fonts?.ready.then(() => {
      if (document.fonts.status === 'loaded') refreshAtTop()
    })

    if (prefersReducedMotion) {
      refreshAtTop()
      return undefined
    }

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

    // Après le montage de Lenis, quand la mise en page et les triggers existent.
    refreshAtTop()

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
    }
  }, [])
}

export { gsap, ScrollTrigger }
