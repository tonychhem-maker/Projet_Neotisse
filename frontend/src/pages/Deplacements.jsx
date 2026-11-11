import DeplacementsListe from '../components/sections/DeplacementsListe'
import { DEPLACEMENTS_FALLBACK } from '../data/deplacements'
import { DEPLACEMENTS_QUERY, useSanityContent } from '../lib/queries'
import './Deplacements.css'

/**
 * Page Déplacements, calée sur la maquette (frame « Déplacements » 446:1739,
 * 1440×1480) : titre « Nos destinations prévue » puis quatre lignes date /
 * ville / logo partenaire soulignées d'une onde textile, et le filet vertical
 * vert avant le pied de page.
 *
 * Le contenu éditorial vient du document Sanity « Page Déplacements » ; les
 * lignes affichent les documents « Déplacement » triés par date. Si aucun
 * n'est publié, le repli local reprend les lignes d'exemple de la maquette.
 */
export default function Deplacements() {
  const fallback = DEPLACEMENTS_FALLBACK
  const data = useSanityContent(DEPLACEMENTS_QUERY, fallback)

  const title = data.page?.heroTitle || DEPLACEMENTS_FALLBACK.page.heroTitle
  const items = Array.isArray(data.items) && data.items.length > 0 ? data.items : DEPLACEMENTS_FALLBACK.items

  return (
    <div className="deplacements-page cq">
      <DeplacementsListe title={title} items={items} />
    </div>
  )
}
