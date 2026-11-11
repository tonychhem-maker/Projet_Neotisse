import flecheUrl from '../../assets/ateliers/fleche.svg?url'
import './LivreDorCommentaires.css'

/**
 * Liste des témoignages du livre d'or, calée sur la maquette (frame
 * « Livre d'or » 424:684, de y1079 à y1780) :
 *
 * - une flèche verticale centrée (y1079) puis le lien « voir tous les
 *   commentaires » (21px, #35985F, centré, y1137) ;
 * - la rangée de trois cartes sable (459×425, interstice 12px, y1242,
 *   largeur totale 1401px) : témoignage 18/30 puis bloc auteur (portrait
 *   rond + nom 24px), espacés de 164px comme dans la maquette ;
 * - le filet horizontal (1377px, y1691) avant le pied de page.
 *
 * Les trois cartes de la maquette portent le même texte d'exemple : côté
 * site, elles affichent les derniers témoignages publiés dans Sanity.
 */
export default function LivreDorCommentaires({ seeAllLink = {}, testimonials = [] }) {
  const href = seeAllLink.to || '#commentaires'

  return (
    <section className="livre-dor-comments" id="commentaires" aria-label="Témoignages">
      <div className="livre-dor-comments__more">
        <img className="livre-dor-comments__arrow" src={flecheUrl} alt="" aria-hidden="true" />
        <a className="livre-dor-comments__link" href={href}>
          {seeAllLink.label || 'voir tous les commentaires'}
        </a>
      </div>

      {testimonials.length > 0 && (
        <ul className="livre-dor-comments__cards">
          {testimonials.map((item) => (
            <li className="livre-dor-card" key={item.id || item.author}>
              <div className="livre-dor-card__body">
                <blockquote className="livre-dor-card__quote">
                  <p>{item.message}</p>
                </blockquote>
                <figure className="livre-dor-card__author">
                  <span className="livre-dor-card__avatar" aria-hidden="true" />
                  <figcaption className="livre-dor-card__name">
                    {item.author}
                    {item.organisation ? ` — ${item.organisation}` : ''}
                  </figcaption>
                </figure>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="livre-dor-comments__rule" aria-hidden="true" />
    </section>
  )
}
