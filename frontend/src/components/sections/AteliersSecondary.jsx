import { useRef } from 'react'
import { useTextReveal } from '../../lib/reveal'
import './AteliersSecondary.css'

/**
 * Sections secondaires de la page Ateliers (Conférence, Expérimentation
 * archéologique…). Maquette : deux colonnes de texte séparées par un filet
 * vertical dégradé à mi-largeur, titres en Boldonse 40px, corps Outfit 20px.
 */
export default function AteliersSecondary({ sections = [] }) {
  const scope = useRef(null)

  useTextReveal(scope)

  if (!sections.length) return null

  return (
    <section className="ateliers-secondary" ref={scope}>
      <div className="ateliers-secondary__grid" data-columns={sections.length}>
        {sections.map((section) => (
          <article className="ateliers-secondary__col" key={section._key ?? section.title}>
            <h2 className="ateliers-secondary__title">
              <span className="reveal-line">
                <span className="block">{section.title}</span>
              </span>
            </h2>
            {section.text && (
              <p className="ateliers-secondary__text">
                <span className="reveal-line">
                  <span className="block">{section.text}</span>
                </span>
              </p>
            )}
          </article>
        ))}
      </div>

      <span className="ateliers-secondary__line" aria-hidden="true" />
    </section>
  )
}
