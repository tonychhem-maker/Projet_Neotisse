import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '../../lib/smoothScroll'
import { useReveal, useTextReveal } from '../../lib/reveal'
import './AProposHistoire.css'

gsap.registerPlugin(useGSAP)

/**
 * Section « histoire » de la page À propos, calée sur la maquette : une
 * grande photo pleine largeur (62px des bords) surmontée du mot « Neotisse »
 * en blanc translucide, puis le titre « L'histoire de l'association » et son
 * texte à gauche, une photo plus petite à droite.
 *
 * La grande image est en parallax : elle glisse plus lentement que la page
 * pendant qu'elle traverse la fenêtre (GSAP ScrollTrigger en scrub, sans
 * pin). L'image déborde de 12,5 % de chaque côté de son cadre pour ne jamais
 * laisser de vide. Le parallax est désactivé en réduction des mouvements : le
 * CSS ne rogne l'image que dans ce cas (classe `is-animated`).
 *
 * Le fil gauche de la bannière se poursuit derrière la grande image : la
 * figure passe dessus naturellement (elle est peinte après la section
 * précédente dans le flux du document).
 */
export default function AProposHistoire({
  image,
  bannerTitle = '',
  title = '',
  text = '',
  histoireImage,
}) {
  const scope = useRef(null)

  useTextReveal(scope)
  useReveal(scope)

  useGSAP(
    () => {
      const root = scope.current
      if (!root) return undefined

      const figure = root.querySelector('.a-propos-histoire__banner')
      const img = figure?.querySelector('img')
      if (!figure || !img) return undefined

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // La classe autorise le CSS à rogner l'image (overflow + débord).
        figure.classList.add('is-animated')

        const drift = gsap.fromTo(
          img,
          { yPercent: -10 },
          {
            yPercent: 10,
            ease: 'none',
            scrollTrigger: {
              trigger: figure,
              start: 'top bottom', // l'image entre par le bas de la fenêtre
              end: 'bottom top', // elle sort par le haut
              scrub: 0.6,
            },
          },
        )

        return () => {
          drift.scrollTrigger?.kill()
          drift.kill()
          figure.classList.remove('is-animated')
          gsap.set(img, { clearProps: 'transform' })
        }
      })

      return () => mm.revert()
    },
    { scope },
  )

  return (
    <section className="a-propos-histoire" ref={scope}>
      <figure className="a-propos-histoire__banner" data-reveal>
        {image?.src && <img src={image.src} alt={image.alt ?? ''} loading="eager" />}
        {bannerTitle && (
          <strong className="a-propos-histoire__banner-title" aria-hidden="true">
            {bannerTitle}
          </strong>
        )}
      </figure>

      <div className="a-propos-histoire__row">
        <div className="a-propos-histoire__col">
          <h2 className="a-propos-histoire__title">
            <span className="reveal-line">
              <span className="block">{title}</span>
            </span>
          </h2>
          {text && (
            <p className="a-propos-histoire__text">
              <span className="reveal-line">
                <span className="block">{text}</span>
              </span>
            </p>
          )}
        </div>

        {histoireImage?.src && (
          <figure className="a-propos-histoire__figure" data-reveal>
            <img src={histoireImage.src} alt={histoireImage.alt ?? ''} loading="lazy" />
          </figure>
        )}
      </div>
    </section>
  )
}
