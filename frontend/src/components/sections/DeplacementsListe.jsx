import logoPlaceholder from '../../assets/deplacements/logo-lozere-tourisme.png'
import filVague from '../../assets/deplacements/fil-vague.svg?raw'
import './DeplacementsListe.css'

/**
 * Formats une date ISO (YYYY-MM-DD) en « Le 2 novembre 2027 ».
 * Le midi évite que les fuseaux négatifs ne reculent la date d'un jour.
 */
function formatDate(iso) {
  if (!iso) return null
  const date = new Date(`${iso}T12:00:00`)
  if (Number.isNaN(date.getTime())) return null
  return `Le ${new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)}`
}

/**
 * Ligne de la liste des déplacements, calée sur la maquette (item 498×83,
 * fond sable) : logo du partenaire à gauche (encart 83×55, centré), date
 * (Outfit 500, 18px, x107), onde textile bicolore derrière le texte (171,5×84
 * à x156) puis « - Ville » (Outfit 500, 31px, x380).
 */
function DeplacementsItem({ item }) {
  const date = formatDate(item.date)
  const logo = item.partnerLogo?.src || logoPlaceholder
  const alt = item.partnerLogo?.alt || item.partnerName || ''

  return (
    <li className="deplacements-item">
      <span className="deplacements-item__vague" aria-hidden="true" dangerouslySetInnerHTML={{ __html: filVague }} />
      <img className="deplacements-item__logo" src={logo} alt={alt} loading="lazy" />
      {date && <span className="deplacements-item__date">{date}</span>}
      {item.city && <span className="deplacements-item__city">- {item.city}</span>}
    </li>
  )
}

/**
 * Liste des déplacements, calée sur la maquette (frame « Déplacements »
 * 446:1739, 1440×1480) :
 *
 * - le titre (64px, #095228, x30 y185) ;
 * - quatre lignes (498×83, écart 24) posées à partir de y349 ;
 * - le filet vertical vert (#095228, x568, 457px de haut à partir de y346).
 *
 * Les dimensions desktop sont en `cqw` (px/14.4 sur la maquette 1440).
 */
export default function DeplacementsListe({ title = '', items = [] }) {
  return (
    <section className="deplacements" aria-labelledby="deplacements-title">
      <h1 className="deplacements__title" id="deplacements-title">
        {title}
      </h1>
      <ul className="deplacements__liste">
        {items.map((item, index) => (
          <DeplacementsItem key={item._id || `item-${index}`} item={item} />
        ))}
      </ul>
      <span className="deplacements__ligne" aria-hidden="true" />
    </section>
  )
}
