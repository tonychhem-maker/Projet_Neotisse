import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../lib/smoothScroll'

/**
 * Fil textile inline (SVG importé avec `?raw`) dont le tracé suit le scroll.
 *
 * Le SVG maquette contient un seul chemin stroké (dégradé) : on pose en JS un
 * `stroke-dasharray` égal à sa longueur, puis GSAP ramène `stroke-dashoffset`
 * à zéro en scrub (ScrollTrigger) pendant que le fil traverse la fenêtre — il
 * se trace en suivant le défilement, et se défait en remontant. Les fils posés
 * en haut de page (bannières Ateliers, À propos) ont une fenêtre qui commence
 * avant le point de départ du scroll : ils sont donc déjà partiellement tracés
 * au chargement.
 *
 * Sans JavaScript, ou en réduction des mouvements, le fil reste entièrement
 * tracé : rien n'est jamais masqué par défaut.
 *
 *   <Fil svg={filHero} className="ateliers-hero__fil" />
 */
export default function Fil({ svg, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const root = ref.current
    if (!root || !svg) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined
    }

    const paths = [...root.querySelectorAll('path')]
    if (!paths.length) return undefined

    // État de départ posé ici (et pas en CSS) : la longueur dépend du tracé.
    paths.forEach((path) => {
      const length = path.getTotalLength()
      path.style.strokeDasharray = `${length}`
    })

    const tween = gsap.fromTo(
      paths,
      { strokeDashoffset: (index, path) => path.getTotalLength() },
      {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top bottom', // le fil entre par le bas de la fenêtre
          end: 'bottom top', // il est entièrement tracé en la quittant
          scrub: true,
          invalidateOnRefresh: true,
        },
      },
    )

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
      paths.forEach((path) => {
        path.style.strokeDasharray = ''
        path.style.strokeDashoffset = ''
      })
    }
  }, [svg])

  return (
    <div
      ref={ref}
      className={`fil ${className}`.trim()}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
