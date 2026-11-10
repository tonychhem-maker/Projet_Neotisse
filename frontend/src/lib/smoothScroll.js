import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Défilement fluide (Lenis) synchronisé avec GSAP ScrollTrigger.
 *
 * - Si l'utilisateur a activé « réduire les animations », Lenis n'est pas
 *   instancié : le défilement natif est conservé.
 * - Lenis pilote ScrollTrigger via `scrollerProxy` + `ScrollTrigger.update`
 *   à chaque frame, ce qui garde les animations parfaitement synchronisées.
 */
export function useSmoothScroll() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

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
