import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import CarteFrance from '../components/sections/CarteFrance'
import DeplacementsListe from '../components/sections/DeplacementsListe'
import Button from '../components/ui/Button'
import Fil from '../components/ui/Fil'
import { DEPLACEMENTS_FALLBACK } from '../data/deplacements'
import { DEPLACEMENTS_QUERY, useSanityContent } from '../lib/queries'
import { formatDateComplete } from '../lib/dates'
import { useReveal } from '../lib/reveal'
import filBoucle from '../assets/deplacements/fil-boucle.svg?raw'
import './Deplacements.css'

/**
 * Recherche insensible à la casse et aux accents (« Paris » trouve « paris »,
 * « novembre » trouve la date du 2 novembre 2027).
 */
function normaliser(valeur) {
  return (valeur || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

/**
 * Page Déplacements, calée sur la maquette (frame « Déplacements » 424:711,
 * 1440×1792) :
 *
 * - le titre « Nos prochaines mobilités » (Boldonse 64px, x35 y187) ;
 * - la colonne gauche (x40) : champ de recherche « Date ou lieu » (498×56)
 *   et la liste défilante des événements (blocs sable 498×72, barre de
 *   défilement verte à droite des blocs) ; chaque événement porte ville,
 *   logo et date venus de Sanity — le survol allume son point sur la carte,
 *   le clic recentre la carte dessus et ouvre sa bulle ;
 * - la carte de France interactive (Leaflet, 750px, collée au bord droit) :
 *   un point vert par événement (géocodé par code postal via
 *   geo.api.gouv.fr), une bulle date + lieu + texte au passage sur le point
 *   (voir CarteFrance) ;
 * - la carte sable (1360×387, x41 y1017, coins arrondis 8) qui réunit
 *   l'introduction (« retrouvez nos déplacements », bouton « Contactez
 *   nous ») et la dernière actualité en vignette photo 467×284 marquée
 *   « Neotisse », qui renvoie vers la page Actualités ; le fil textile se
 *   trace au scroll en fond.
 *
 * Le contenu éditorial vient du document Sanity « Page Déplacements », les
 * lignes des documents « Déplacement » triés par date et la vignette du
 * dernier document « Actualité ». Si rien n'est publié, le repli local
 * reprend la maquette.
 */
export default function Deplacements() {
  const fallback = DEPLACEMENTS_FALLBACK
  const data = useSanityContent(DEPLACEMENTS_QUERY, fallback)
  const scope = useRef(null)
  useReveal(scope)

  const [query, setQuery] = useState('')
  // Ligne de la liste survolée : illumine son point sur la carte.
  const [itemSurvole, setItemSurvole] = useState(null)
  // La carte expose `centrer(cle)` : recentre sur un événement au clic.
  const carteRef = useRef(null)

  const title = data.page?.heroTitle || fallback.page.heroTitle
  const introTitle = data.page?.introTitle || fallback.page.introTitle
  const introText = data.page?.introText || fallback.page.introText
  const ctaLink = data.page?.ctaLink?.to ? data.page.ctaLink : fallback.page.ctaLink
  const items = Array.isArray(data.items) && data.items.length > 0 ? data.items : fallback.items
  const event = data.event?.title ? data.event : fallback.event

  // Filtrage « Date ou lieu » : ville, code postal, date ISO ou date lisible.
  const recherche = query.trim()
  const itemsFiltres = recherche
    ? items.filter((item) => {
        const cible = normaliser(
          [item.city, item.codePostal, item.date, formatDateComplete(item.date)].filter(Boolean).join(' '),
        )
        return cible.includes(normaliser(recherche))
      })
    : items

  // Destination du « voir plus » : le lien manuel gagne, sinon la page détail
  // de l'actualité, sinon la liste des actualités.
  const eventLieu = event.link?.to || (event.slug ? `/actualites/${event.slug}` : '/actualites')

  return (
    <div className="deplacements-page cq">
      <section className="deplacements" ref={scope} aria-labelledby="deplacements-title">
        <h1 className="deplacements__title" id="deplacements-title">
          {title}
        </h1>

        <div className="deplacements__grille">
          <Fil svg={filBoucle} className="deplacements__fil" />

          <div className="deplacements__colonne">
            <form className="deplacements__recherche" role="search" onSubmit={(e) => e.preventDefault()}>
              <label className="sr-only" htmlFor="deplacements-recherche-input">
                Rechercher un déplacement par date ou lieu
              </label>
              <input
                id="deplacements-recherche-input"
                className="deplacements__recherche-input"
                type="search"
                placeholder="Date ou lieu"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <svg className="deplacements__recherche-loupe" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <line x1="16" y1="16" x2="22" y2="22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </form>

            <DeplacementsListe
              items={itemsFiltres}
              onHighlight={setItemSurvole}
              onEventClick={(item) => carteRef.current?.centrer(item.codePostal || item.city)}
              emptyMessage={
                recherche ? `Aucun déplacement ne correspond à « ${recherche} »` : null
              }
            />
          </div>

          <CarteFrance
            ref={carteRef}
            className="deplacements__carte"
            items={items}
            itemActifId={itemSurvole?._id || null}
          />
        </div>

        <section className="depl-events" aria-labelledby="depl-events-title">
          <div className="depl-events__carte" data-reveal>
            <div className="depl-events__texte">
              <h2 className="depl-events__titre" id="depl-events-title">
                {introTitle}
              </h2>
              <p className="depl-events__intro-texte">{introText}</p>
              <Button to={ctaLink.to || '/contact'} className="depl-events__cta">
                {ctaLink.label || 'Contactez nous'}
              </Button>
            </div>

            <Link
              className="depl-events__visuel"
              to={eventLieu}
              aria-label={event.title || 'Voir notre dernier événement'}
            >
              {event.image?.src && (
                <img
                  className="depl-events__image"
                  src={event.image.src}
                  alt={event.image?.alt || ''}
                  loading="lazy"
                />
              )}
              <span className="depl-events__marque" aria-hidden="true">
                Neotisse
              </span>
            </Link>
          </div>
        </section>
      </section>
    </div>
  )
}
