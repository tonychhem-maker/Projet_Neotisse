import { useRef } from 'react'
import { useReveal, useTextReveal } from '../../lib/reveal'
import './AProposHistoire.css'

/**
 * Section « histoire » de la page À propos, calée sur la maquette : une
 * grande photo pleine largeur (62px des bords) surmontée du mot « Neotisse »
 * en blanc translucide, puis le titre « L'histoire de l'association » et son
 * texte à gauche, une photo plus petite à droite.
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
