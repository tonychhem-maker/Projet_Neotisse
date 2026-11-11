import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useReveal, useTextReveal } from '../../lib/reveal'
import flecheUrl from '../../assets/ateliers/fleche.svg?url'
import './AteliersCta.css'

/**
 * Bloc final de la page Ateliers, calé sur la maquette : « CONVAINCU ? » en
 * Boldonse 64px, une flèche vers le bas, puis le bouton d'action (351×53,
 * fond #095228). Titre et libellé viennent de Sanity.
 */
export default function AteliersCta({ title = 'CONVAINCU ?', link }) {
  const scope = useRef(null)

  useTextReveal(scope)
  useReveal(scope)

  if (!link?.label) return null

  return (
    <section className="ateliers-cta" ref={scope}>
      <h2 className="ateliers-cta__title reveal-line">
        <span className="block">{title}</span>
      </h2>

      <div className="ateliers-cta__action" data-reveal>
        <img className="ateliers-cta__arrow" src={flecheUrl} alt="" aria-hidden="true" />
        <Link className="ateliers-cta__button" to={link.to ?? '/contact'}>
          {link.label}
        </Link>
      </div>
    </section>
  )
}
