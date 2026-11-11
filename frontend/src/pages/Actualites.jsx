import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '../lib/smoothScroll'
import { useReveal, useTextReveal } from '../lib/reveal'
import Fil from '../components/ui/Fil'
import ActualitesListe from '../components/sections/ActualitesListe'
import { ACTUALITES_FALLBACK } from '../data/actualites'
import filGauche from '../assets/actualites/fil-gauche.svg?raw'
import filDroit from '../assets/actualites/fil-droite.svg?raw'
import { ACTUALITES_QUERY, useSanityContent } from '../lib/queries'
import './Actualites.css'

gsap.registerPlugin(useGSAP)

/**
 * Page Actualités, calée sur la maquette (frame « Actualités » 424:683,
 * 1440×2307) : titre et texte d'introduction centrés, deux cartes
 * d'événement (photo teintée, date en capitales, sur-titre + titre, pastille
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
 *
 * Animations (même langage que les autres pages) : les lignes du titre
 * arrivent de part et d'autre et se rejoignent au centre (timeline GSAP au
 * montage) ; le reste de la page se révèle au scroll via les hooks partagés
 * `useTextReveal` / `useReveal` (masques de lignes et fondus montants). Rien
 * n'est animé en réduction des mouvements.
 */
export default function Actualites() {
  const fallback = ACTUALITES_FALLBACK
  const data = useSanityContent(ACTUALITES_QUERY, fallback)

  const page = data.page ?? fallback.page
  const posts = Array.isArray(data.posts) && data.posts.length > 0 ? data.posts : fallback.posts

  const scope = useRef(null)
  const lignes = String(page.heroTitle ?? '').split(/\r?\n/).filter(Boolean)

  useTextReveal(scope)
  useReveal(scope)

  useGSAP(
    () => {
      const root = scope.current
      if (!root) return undefined

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const spans = root.querySelectorAll('.actualites-hero__ligne')

        // Les lignes arrivent de part et d'autre et se rejoignent au centre :
        // la première depuis la gauche, la seconde depuis la droite, etc.
        const assemble = gsap
          .timeline({ delay: 0.15 })
          .from(
            spans,
            {
              x: (index) => (index % 2 === 0 ? -1 : 1) * window.innerWidth * 0.75,
              opacity: 0,
              duration: 1.25,
              ease: 'expo.out',
              stagger: 0.06,
            },
            0,
          )

        return () => assemble.kill()
      })

      return () => mm.revert()
    },
    { scope },
  )

  return (
    <div className="actualites-page cq" ref={scope}>
      {/* Fils textile : centres d'encombrement relevés dans Figma (208,5 ×
          399,5 et 1358 × 1331, rotation −1,52° / −1,59° en CSS) ; au-dessus
          du texte à gauche, sous les cartes à droite, sous rien d'interactif. */}
      <Fil svg={filGauche} className="actualites-page__fil actualites-page__fil--gauche" />
      <Fil svg={filDroit} className="actualites-page__fil actualites-page__fil--droite" />

      <header className="actualites-hero" aria-labelledby="actualites-title">
        <h1 className="actualites-hero__titre" id="actualites-title">
          {lignes.map((ligne, index) => (
            <span className="actualites-hero__ligne" key={`${ligne}-${index}`}>
              {ligne}
            </span>
          ))}
        </h1>
        {page.introText && <p className="actualites-hero__intro">{page.introText}</p>}
      </header>

      <ActualitesListe posts={posts} moreLink={page.moreLink} />
    </div>
  )
}
