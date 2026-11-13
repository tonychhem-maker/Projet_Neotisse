import logoPlaceholder from '../../assets/deplacements/logo-lozere-tourisme.png'
import filVague from '../../assets/deplacements/fil-vague.svg?raw'
import { formatDateComplete } from '../../lib/dates'
import './DeplacementsListe.css'

/**
 * Ligne événement (base de design de la maquette : bloc sable 498×72, logo
 * à gauche, date puis onde textile et « - Ville »). Elle est interactive :
 * le survol l'encadre de vert et allume le point correspondant sur la
 * carte ; le clic recentre la carte sur le point et ouvre sa bulle.
 */
function DeplacementsItem({ item, onHighlight, onEventClick }) {
  const date = formatDateComplete(item.date)
  const logo = item.logo?.src || logoPlaceholder
  const alt = item.logo?.alt || ''

  const activer = () => onEventClick?.(item)

  return (
    <li
      className="deplacements-item"
      role="button"
      tabIndex={0}
      onMouseEnter={() => onHighlight?.(item)}
      onMouseLeave={() => onHighlight?.(null)}
      onFocus={() => onHighlight?.(item)}
      onBlur={() => onHighlight?.(null)}
      onClick={activer}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          activer()
        }
      }}
    >
      <span className="deplacements-item__vague" aria-hidden="true" dangerouslySetInnerHTML={{ __html: filVague }} />
      <img className="deplacements-item__logo" src={logo} alt={alt} loading="lazy" />
      {date && <span className="deplacements-item__date">{date}</span>}
      {item.city && <span className="deplacements-item__city">{item.city}</span>}
    </li>
  )
}

/**
 * Liste défilante des déplacements : les événements (blocs sable de la
 * maquette) défilent verticalement dans un conteneur à hauteur fixe, avec
 * la barre de défilement verticale verte posée à leur droite (celle de la
 * maquette). Le filtrage (« Date ou lieu ») est piloté par la page : ce
 * composant affiche `items` tel quel et un message quand la recherche ne
 * renvoie rien — aucun déplacement n'est jamais masqué silencieusement.
 *
 * - `onHighlight` est appelé avec la ligne survolée / focalisée puis null :
 *   la page s'en sert pour illuminer le point correspondant sur la carte.
 * - `onEventClick` est appelé au clic (ou Entrée) sur une ligne : la page
 *   recentre la carte sur ce point et ouvre sa bulle.
 */
export default function DeplacementsListe({
  items = [],
  emptyMessage = null,
  onHighlight = null,
  onEventClick = null,
}) {
  return (
    <div className="deplacements-liste">
      <div
        className="deplacements-liste__defilement"
        onMouseLeave={() => onHighlight?.(null)}
      >
        <ul className="deplacements__liste">
          {items.map((item, index) => (
            <DeplacementsItem
              key={item._id || `item-${index}`}
              item={item}
              onHighlight={onHighlight}
              onEventClick={onEventClick}
            />
          ))}
        </ul>
        {items.length === 0 && emptyMessage && (
          <p className="deplacements-liste__vide">{emptyMessage}</p>
        )}
      </div>
    </div>
  )
}
