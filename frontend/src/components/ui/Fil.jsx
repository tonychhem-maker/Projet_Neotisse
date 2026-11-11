import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/smoothScroll'

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
 * tracé et immobile : rien n'est jamais masqué par défaut.
 *
 * `float` ajoute une dérive continue (deux oscillations de périodes
 * différentes sur x et y, qui se composent en un flottement organique) :
 * le fil semble « vivant » même à l'arrêt. Transformations uniquement —
 * le tracé au scroll et la mise en page ne bougent pas.
 *
 *   <Fil svg={filHero} className="ateliers-hero__fil" />
 *   <Fil svg={filOndule} className="livre-dor-page__fil--ondule" float />
 */
export default function Fil({ svg, className = '', float = false }) {
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

    // Dérive continue : deux tweens de périodes différentes sur x et y se
    // composent en un flottement organique, jamais tout à fait répétitif.
    // GSAP lit la transformation CSS existante (rotation des fils posés en
    // biais) et la conserve.
    const drifts = float
      ? [
          gsap.to(root, {
            x: 18,
            duration: 6.5,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          }),
          gsap.to(root, {
            y: -22,
            duration: 4.2,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          }),
        ]
      : []

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
      drifts.forEach((drift) => drift.kill())
      paths.forEach((path) => {
        path.style.strokeDasharray = ''
        path.style.strokeDashoffset = ''
      })
    }
  }, [svg, float])

  return (
    <div
      ref={ref}
      className={`fil ${className}`.trim()}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
