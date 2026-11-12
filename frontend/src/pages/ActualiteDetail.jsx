import { useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useReveal, useTextReveal } from '../lib/reveal'
import { formatMoisAnnee } from '../lib/dates'
import RichText from '../components/ui/RichText'
import BarreLecture from '../components/ui/BarreLecture'
import flecheRetourUrl from '../assets/actualites/fleche-lien.svg?url'
import { ACTUALITES_FALLBACK } from '../data/actualites'
import { ACTUALITE_DETAIL_QUERY, useSanityContent } from '../lib/queries'
import './ActualiteDetail.css'

/**
 * Page détail d'une actualité, calée sur la maquette (frame « actu »
 * 451:1858, 1440×1387) : flèche de retour à gauche du titre, titre
 * Boldonse centré, date en capitales, puis le bloc lecture — image
 * portrait (355×511) à gauche et corps du texte (708px, Outfit 20/30)
 * à droite — avant le pied de page.
 *
 * Elle s'affiche quand on clique « voir plus » sur une carte d'actualité
 * (route /actualites/:slug). Le contenu vient du document Sanity
 * « Actualité » correspondant au slug : titre, date, image de couverture
 * et corps en Portable Text ; à défaut, le repli de démonstration est
 * affiché.
 *
 * La barre verte collée au bord droit (Line 24 de la maquette) se remplit
 * de vert sapin à mesure que la page défile ; elle n'existe que si le
 * contenu dépasse la fenêtre.
 */
export default function ActualiteDetail() {
  const { slug = '' } = useParams()

  // Le paramètre d'URL est encodé : on le décode puis on neutralise tout
  // ce qui pourrait casser la requête GROQ (guillemets).
  let slugPropre = slug
  try {
    slugPropre = decodeURIComponent(slug)
  } catch {
    // segment d'URL mal encodé : tel quel
  }
  slugPropre = slugPropre.replace(/"/g, '')

  const data = useSanityContent(ACTUALITE_DETAIL_QUERY(slugPropre), {
    post: ACTUALITES_FALLBACK.detail,
  })
  const post = data.post ?? ACTUALITES_FALLBACK.detail

  // Ligne de date « du 9 au 10 octobre 2027 » : la précision saisie puis
  // le mois + l'année de la date d'événement (ou de publication à défaut).
  const dateLigne = [post.dateLabel, formatMoisAnnee(post.eventDate || post.publishedAt)]
    .filter(Boolean)
    .join(' ')

  const scope = useRef(null)
  useTextReveal(scope)
  useReveal(scope)

  return (
    <div className="actualite-detail" ref={scope}>
      <BarreLecture contenu={data} />

      <Link to="/actualites" className="actualite-detail__retour" aria-label="Retour aux actualités">
        <img src={flecheRetourUrl} alt="" aria-hidden="true" />
      </Link>

      <article>
        <h1 className="actualite-detail__titre" data-reveal>
          {post.title}
        </h1>
        {dateLigne && (
          <p className="actualite-detail__date" data-reveal>
            {dateLigne}
          </p>
        )}

        <div className="actualite-detail__bloc">
          {post.image?.src && (
            <figure className="actualite-detail__figure" data-reveal>
              <img src={post.image.src} alt={post.image.alt || ''} />
            </figure>
          )}
          <div className="actualite-detail__texte" data-reveal>
            <RichText value={post.body} />
          </div>
        </div>
      </article>
    </div>
  )
}
