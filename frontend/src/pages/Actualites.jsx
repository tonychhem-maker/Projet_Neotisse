import Fil from '../components/ui/Fil'
import ActualitesListe from '../components/sections/ActualitesListe'
import { ACTUALITES_FALLBACK } from '../data/actualites'
import filGauche from '../assets/actualites/fil-gauche.svg?raw'
import filDroit from '../assets/actualites/fil-droite.svg?raw'
import { ACTUALITES_QUERY, useSanityContent } from '../lib/queries'
import './Actualites.css'

/**
 * Page Actualités, calée sur la maquette (frame « Actualités » 424:683,
 * 1440×2307) : titre et texte d'introduction centrés, deux cartes
 * d'événement (photo teintée, date en capitales, structure + titre, pastille
 * « voir plus »), lien « voir plus d'événements » puis bande dégradée avant
 * le pied de page.
 *
 * Le contenu éditorial vient du document Sanity « Page Actualités » ; les
 * cartes affichent les deux actualités les plus récentes (documents
 * « Actualité »). Deux fils textile décorent la page (couches « Fil textile
 * — courbes et boucle » de la maquette) : celui de gauche passe au-dessus du
 * titre et du texte comme dans Figma, celui de droite passe sous les cartes ;
 * leur tracé suit le scroll (composant `Fil`), sans jamais gêner la lecture
 * ni les interactions. La maquette double le fil de gauche à l'identique :
 * un seul suffit au rendu.
 */
export default function Actualites() {
  const fallback = ACTUALITES_FALLBACK
  const data = useSanityContent(ACTUALITES_QUERY, fallback)

  const page = data.page ?? fallback.page
  const posts = Array.isArray(data.posts) && data.posts.length > 0 ? data.posts : fallback.posts

  return (
    <div className="actualites-page cq">
      {/* Fils textile : centres d'encombrement relevés dans Figma (208,5 ×
          399,5 et 1358 × 1331, rotation −1,52° / −1,59° en CSS) ; au-dessus
          du texte à gauche, sous les cartes à droite, sous rien d'interactif. */}
      <Fil svg={filGauche} className="actualites-page__fil actualites-page__fil--gauche" />
      <Fil svg={filDroit} className="actualites-page__fil actualites-page__fil--droite" />

      <header className="actualites-hero" aria-labelledby="actualites-title">
        <h1 className="actualites-hero__titre" id="actualites-title">
          {page.heroTitle}
        </h1>
        {page.introText && <p className="actualites-hero__intro">{page.introText}</p>}
      </header>

      <ActualitesListe posts={posts} moreLink={page.moreLink} />
    </div>
  )
}
