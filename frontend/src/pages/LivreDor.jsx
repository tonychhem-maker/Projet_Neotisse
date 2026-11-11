import { useMemo } from 'react'
import Fil from '../components/ui/Fil'
import LivreDorCommentaires from '../components/sections/LivreDorCommentaires'
import LivreDorIntro from '../components/sections/LivreDorIntro'
import { LIVRE_DOR_FALLBACK } from '../data/livreDor'
import filBoucle1 from '../assets/apropos/fil-milieu-1.svg?raw'
import filOndule from '../assets/livredor/fil-ondule.svg?raw'
import { LIVRE_DOR_QUERY, useSanityContent } from '../lib/queries'
import './LivreDor.css'

/**
 * Page Livre d'or, calée sur la maquette (frame « Livre d'or » 424:684,
 * 1440×2125) : titre, filet et témoignage vedette à gauche, formulaire de
 * dépôt d'avis à droite, puis flèche + lien, trois cartes de témoignages et
 * le grand filet avant le pied de page.
 *
 * Le contenu éditorial vient du document Sanity « Page Livre d'or » ; les
 * cartes affichent les trois derniers témoignages publiés (documents
 * « Livre d'or » publiés). Trois fils textile décorent la page : deux fils
 * de la maquette (couches « Fil textile — courbes et boucle », posés aux
 * coordonnées relevées et inclinés comme dans Figma), plus un fil ondulant
 * qui remplace celui de la maquette (il passait sur la zone de message) —
 * il ne recouvre aucun contenu et dérive doucement en continu (GSAP). Leur
 * tracé suit le scroll (composant `Fil`).
 */
export default function LivreDor() {
  const fallback = useMemo(() => LIVRE_DOR_FALLBACK, [])
  const fetched = useSanityContent(LIVRE_DOR_QUERY, fallback)

  const page = fetched.page ?? LIVRE_DOR_FALLBACK.page

  const testimonials = useMemo(() => {
    const list = Array.isArray(fetched.testimonials) ? fetched.testimonials : []
    return list.length > 0 ? list : LIVRE_DOR_FALLBACK.testimonials
  }, [fetched.testimonials])

  const featured = page.featured ?? LIVRE_DOR_FALLBACK.page.featured

  return (
    <div className="livre-dor-page cq">
      {/* Fils textile : (397,1162) et (−275,706) inclinés à −108,79° dans la
          frame (position du centre de l'encombrement relevée dans Figma) ;
          au-dessus du fond, sous rien d'interactif. Le fil ondulant est posé
          sous le bouton d'envoi et à droite du lien central, il ne recouvre
          aucun contenu (voir LivreDor.css). */}
      <Fil svg={filBoucle1} className="livre-dor-page__fil livre-dor-page__fil--cartes" />
      <Fil svg={filBoucle1} className="livre-dor-page__fil livre-dor-page__fil--gauche" />
      <Fil svg={filOndule} className="livre-dor-page__fil livre-dor-page__fil--ondule" float />

      <LivreDorIntro
        title={page.heroTitle}
        sectionTitle={page.sectionTitle}
        featured={featured}
        testimonials={testimonials}
      />

      <LivreDorCommentaires seeAllLink={page.seeAllLink} testimonials={testimonials} />
    </div>
  )
}
