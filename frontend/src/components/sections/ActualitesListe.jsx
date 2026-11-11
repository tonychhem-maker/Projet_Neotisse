import flecheLienUrl from '../../assets/actualites/fleche-lien.svg?url'
import flechePastilleUrl from '../../assets/actualites/fleche-pastille.svg?url'
import './ActualitesListe.css'

const CATEGORIES = {
  evenement: 'Événement',
  atelier: 'Atelier',
  partenariat: 'Partenariat',
  presse: 'Presse',
}

/**
 * Formate une date ISO en « octobre 2027 » (mois + année de la carte).
 * On garde la partie calendrier UTC de la date, placée à midi local pour
 * que les fuseaux négatifs ne la fassent pas reculer d'un jour.
 */
function formatMoisAnnee(iso) {
  if (!iso) return null
  const date = new Date(`${String(iso).slice(0, 10)}T12:00:00`)
  if (Number.isNaN(date.getTime())) return null
  return new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(date)
}

/**
 * Carte d'événement, calée sur la maquette (1346×359, fond #E4DCCE) :
 * photo teintée à gauche (664×359), mois + précision de date au centre
 * (x642, Outfit 48px / 18px, capitales), pastille « voir plus » (pastille
 * verte 39×41 + chevron blanc) puis structure / titre à droite (x975,
 * Outfit 22px vert sapin / 32px Light noir).
 */
function ActualitesCarte({ post }) {
  const image = post.image?.src
  const kicker = post.kicker ?? (post.category ? `${CATEGORIES[post.category]} -` : null)
  const mois = post.monthYear || formatMoisAnnee(post.publishedAt)

  return (
    <li className="actualites-carte-item">
      <article className="actualites-carte">
        <span className="actualites-carte__media">
          {image ? (
            <img className="actualites-carte__image" src={image} alt={post.image?.alt || ''} loading="lazy" />
          ) : (
            <span className="actualites-carte__image actualites-carte__image--vide" aria-hidden="true" />
          )}
          <span className="actualites-carte__voile" aria-hidden="true" />
        </span>

        <p className="actualites-carte__date">
          {mois && <span className="actualites-carte__mois">{mois}</span>}
          {post.dateLabel && <span className="actualites-carte__jours">{post.dateLabel}</span>}
        </p>

        <div className="actualites-carte__texte">
          {kicker && <span className="actualites-carte__kicker">{kicker}</span>}
          <h2 className="actualites-carte__titre">{post.title}</h2>
        </div>

        {post.link?.to && (
          <a className="actualites-carte__lien" href={post.link.to}>
            {post.link.label || 'voir plus'}
            <img className="actualites-carte__pastille" src={flechePastilleUrl} alt="" aria-hidden="true" />
          </a>
        )}
      </article>
    </li>
  )
}

/**
 * Liste des actualités, calée sur la maquette (frame « Actualités » 424:683,
 * de y934 à y1962) :
 *
 * - deux cartes (1346×359, écart 69px, posées à partir de y934) ;
 * - le lien « voir plus d'événements » centré (flèche 42×15 + texte 21px
 *   souligné, #35985F, y1801) ;
 * - la bande dégradée (1440×108, flou d'arrière-plan) qui fond la page vers
 *   le pied de page (y1854).
 *
 * Les dimensions desktop sont en `cqw` (px/14.4 sur la maquette 1440).
 */
export default function ActualitesListe({ posts = [], moreLink = {} }) {
  return (
    <section className="actualites-liste" aria-label="Actualités et événements">
      {posts.length > 0 && (
        <ul className="actualites-liste__cartes">
          {posts.map((post, index) => (
            <ActualitesCarte key={post.id || `post-${index}`} post={post} />
          ))}
        </ul>
      )}

      {moreLink.label && (
        <a className="actualites-liste__plus" href={moreLink.to || '#actualites'}>
          <img className="actualites-liste__plus-fleche" src={flecheLienUrl} alt="" aria-hidden="true" />
          {moreLink.label}
        </a>
      )}

      <div className="actualites-liste__bande" aria-hidden="true" />
    </section>
  )
}
