import { useState } from 'react'
import Fil from '../ui/Fil'
import filMilieu from '../../assets/ateliers/fil-milieu.svg?raw'
import flecheUrl from '../../assets/ateliers/fleche.svg?url'
import './AteliersFormats.css'

/**
 * Les formats d'atelier (Participatif, Enfants, Démonstratif…).
 *
 * Maquette : une colonne de textes à gauche (55px du bord, largeur 664px),
 * une pile d'images collée au bord droit (largeur 720px, hauteur 403px).
 *
 * Seul le premier format est affiché au départ ; le lien « voir plus
 * d'ateliers » déplie les suivants (et les replie). Le dépliage est animé :
 * les deux colonnes de contenu supplémentaire sont dans un conteneur dont la
 * hauteur glisse de 0 à sa hauteur naturelle (`grid-template-rows: 0fr →
 * 1fr`, voir le CSS), le contenu fondu-glissé par-dessus. En réduction des
 * mouvements, le basculement reste instantané.
 *
 * Le fil du milieu ne traverse que les images 2 et 3 : il n'apparaît qu'une
 * fois déplié, puis se trace en suivant le scroll pendant que le contenu se
 * déroule sous les yeux.
 *
 * Aucune autre animation au scroll ici : cette section est le cœur de la
 * page, son contenu visible doit apparaître sans détour. Les images sont
 * chargées en `eager` pour ne jamais laisser la colonne vide.
 */
export default function AteliersFormats({ formats = [] }) {
  const [open, setOpen] = useState(false)

  const [firstFormat, ...otherFormats] = formats
  const hasOthers = otherFormats.length > 0

  const renderText = (format) => (
    <article className="ateliers-format" key={format.id}>
      <h2 className="ateliers-format__title">{format.title}</h2>
      {format.text && <p className="ateliers-format__text">{format.text}</p>}
    </article>
  )

  const renderFigure = (format, index) => {
    // Tant qu'un format n'a pas d'image, on reprend celle du format
    // précédent (ou la première) pour ne jamais laisser de vide.
    const previous = index > 0 ? formats[index - 1].image : undefined
    const src = format.image ?? previous ?? formats[0]?.image
    return (
      <figure
        className={`ateliers-format__figure${index === 1 ? ' ateliers-format__figure--rounded' : ''}`}
        key={`${format.id}-img`}
      >
        {src && <img src={src} alt={format.title || ''} loading="eager" />}
      </figure>
    )
  }

  // Les formats 2..n : mêmes blocs, dans un conteneur à hauteur animée.
  const renderCollapse = (children, className) =>
    hasOthers && (
      <div
        className={`ateliers-formats__collapse${open ? ' is-open' : ''} ${className}`.trim()}
        aria-hidden={!open}
      >
        <div className="ateliers-formats__collapse-inner">
          <div className="ateliers-formats__collapse-content">{children}</div>
        </div>
      </div>
    )

  return (
    <section className="ateliers-formats">
      <div className="ateliers-formats__inner">
        <div className="ateliers-formats__texts">
          {firstFormat && renderText(firstFormat)}
          {renderCollapse(otherFormats.map((format) => renderText(format)), 'ateliers-formats__collapse--texts')}
        </div>

        <div className="ateliers-formats__images">
          {firstFormat && renderFigure(firstFormat, 0)}
          {renderCollapse(
            otherFormats.map((format, index) => renderFigure(format, index + 1)),
            'ateliers-formats__collapse--images',
          )}
        </div>
      </div>

      {open && hasOthers && <Fil svg={filMilieu} className="ateliers-formats__fil" />}

      {hasOthers && (
        <div className="ateliers-formats__more">
          <img className="ateliers-formats__arrow" src={flecheUrl} alt="" aria-hidden="true" />
          <button
            type="button"
            className="ateliers-formats__toggle"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? 'voir moins d’ateliers' : 'voir plus d’ateliers'}
          </button>
        </div>
      )}
    </section>
  )
}
