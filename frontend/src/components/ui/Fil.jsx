import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/smoothScroll'

/**
 * Fil textile inline (SVG importé avec `?raw`) dont le tracé suit le scroll.
 *
 * Deux familles de fils coexistent, et l'animation s'adapte :
 *
 * - **Vrais traits** (fil-ondule du livre d'or, fil-vague des déplacements) :
 *   le chemin porte un `stroke` — on pose en JS un `stroke-dasharray` égal à
 *   sa longueur, puis GSAP ramène `stroke-dashoffset` à zéro en scrub
 *   (ScrollTrigger) pendant que le fil traverse la fenêtre : il se trace
 *   réellement, point par point, et se défait en remontant.
 *
 * - **Contours aplatis** (exports Figma des fils Ateliers, À propos et
 *   Actualités) : le trait y a été converti en forme remplie, sans attribut
 *   `stroke` — le dasharray n'y a donc aucun effet. Le fil est alors révélé
 *   par un balayage (`clip-path: inset`) animé par GSAP, depuis le point de
 *   départ du dessin (lu dans le premier `M` du contour) jusqu'à son autre
 *   extrémité : le fil semble se dérouler dans le bon sens.
 *
 * Sans JavaScript, ou en réduction des mouvements, le fil reste entièrement
 * tracé et immobile : rien n'est jamais masqué par défaut (le masque n'est
 * posé qu'en style inline par GSAP).
 *
 * `float` ajoute une dérive continue (deux oscillations de périodes
 * différentes sur x et y, qui se composent en un flottement organique) :
 * le fil semble « vivant » même à l'arrêt. Transformations uniquement —
 * le tracé au scroll et la mise en page ne bougent pas.
 *
 * `start` / `end` resserrent la fenêtre de tracé (syntaxe ScrollTrigger).
 * Un fil posé en haut de page a une fenêtre « top bottom » qui commence
 * avant le premier pixel de scroll : il est donc déjà partiellement tracé
 * au chargement. Pour qu'un tel fil se dessine sous les yeux (page
 * Actualités), on retarde le départ, ex. `start="top 30%"` : il est presque
 * vide au chargement et se trace pendant les premiers tours de molette.
 *
 *   <Fil svg={filHero} className="ateliers-hero__fil" />
 *   <Fil svg={filOndule} className="livre-dor-page__fil--ondule" float />
 */
export default function Fil({ svg, className = '', float = false, start = 'top bottom', end = 'bottom top' }) {
  const ref = useRef(null)

  useEffect(() => {
    const root = ref.current
    if (!root || !svg) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined
    }

    const paths = [...root.querySelectorAll('path')]
    if (!paths.length) return undefined

    // Fenêtre de tracé, commune aux deux modes.
    const scrollTrigger = {
      trigger: root,
      start, // le fil entre par le bas de la fenêtre…
      end, // …et est entièrement tracé en la quittant (sauf surcharge)
      scrub: true,
      invalidateOnRefresh: true,
    }

    // Vrais traits → tracé point par point par dasharray/dashoffset.
    const estTracé = paths.some((path) => path.getAttribute('stroke'))
    let tween

    if (estTracé) {
      // État de départ posé ici (et pas en CSS) : la longueur dépend du tracé.
      paths.forEach((path) => {
        path.style.strokeDasharray = `${path.getTotalLength()}`
      })

      tween = gsap.fromTo(
        paths,
        { strokeDashoffset: (index, path) => path.getTotalLength() },
        { strokeDashoffset: 0, ease: 'none', scrollTrigger },
      )
    } else {
      // Contour aplati → balayage par clip-path, orienté d'après le point de
      // départ du dessin (premier « M » du contour, lu dans le viewBox) : si
      // le fil commence à droite, il se déroule de la droite vers la gauche,
      // et inversement.
      const [, , largeurViewBox = 1] = (root
        .querySelector('svg')
        ?.getAttribute('viewBox') ?? '0 0 1 1')
        .split(/[\s,]+/)
        .map(Number)
      const [, xDépart = 0] = /M\s*([\d.-]+)[\s,]+([\d.-]+)/.exec(
        paths[0].getAttribute('d') ?? '',
      ) ?? []
      const commenceÀDroite = Number(xDépart) > largeurViewBox / 2

      tween = gsap.fromTo(
        root,
        { clipPath: commenceÀDroite ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger },
      )
    }

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
      if (estTracé) {
        paths.forEach((path) => {
          path.style.strokeDasharray = ''
          path.style.strokeDashoffset = ''
        })
      } else {
        gsap.set(root, { clearProps: 'clipPath' })
      }
    }
  }, [svg, float, start, end])

  return (
    <div
      ref={ref}
      className={`fil ${className}`.trim()}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
