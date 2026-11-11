import { useEffect, useRef } from 'react'

/**
 * Fil textile inline (SVG importé avec `?raw`) dont le tracé se dessine.
 *
 * Le SVG maquette contient un seul chemin stroké (dégradé) : on pose en JS un
 * `stroke-dasharray` égal à sa longueur, puis on ramène l'offset à 0 quand le
 * fil entre dans la fenêtre. Sans JavaScript, ou en réduction des mouvements,
 * le CSS laisse le fil entièrement tracé : rien n'est jamais masqué par défaut.
 *
 *   <Fil svg={filHero} className="ateliers-hero__fil" />
 */
export default function Fil({ svg, className = '', duration = 2.4, delay = 0 }) {
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
      path.style.strokeDashoffset = `${length}`
    })

    let observer
    const draw = () => {
      paths.forEach((path) => {
        path.style.transition = `stroke-dashoffset ${duration}s cubic-bezier(0.45, 0, 0.55, 1) ${delay}s`
        path.style.strokeDashoffset = '0'
      })
    }

    observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        draw()
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    observer.observe(root)

    return () => {
      observer.disconnect()
      paths.forEach((path) => {
        path.style.transition = ''
        path.style.strokeDasharray = ''
        path.style.strokeDashoffset = ''
      })
    }
  }, [svg, duration, delay])

  return (
    <div
      ref={ref}
      className={`fil ${className}`.trim()}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
