import { useEffect, useRef, useState } from 'react'
import { gsap } from '../../lib/smoothScroll'
import './BarreLecture.css'

/**
 * Barre verte de lecture (maquette « actu ») : un fin rail vert collé au
 * bord droit se remplit de vert sapin à mesure que la page défile.
 *
 * Elle n'apparaît que si le contenu dépasse la fenêtre — sans scroll il
 * n'y a rien à suivre, la barre reste purement décorative dans la maquette
 * et disparaît ici. Le remplissage est un scrub GSAP sur la plage de scroll
 * de la page ; en réduction des mouvements il est simplement totalement
 * rempli, immobile.
 *
 * `contenu` : une valeur qui change quand la page reçoit son contenu
 * (données Sanity…) — la détection du scroll reposant sur la hauteur du
 * document, on la revérifie à ce moment-là.
 */
export default function BarreLecture({ contenu }) {
  const rempli = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const verifier = () => {
      const racine = document.documentElement
      setVisible(racine.scrollHeight > racine.clientHeight + 1)
    }
    verifier()
    // Le contenu Sanity et le chargement des images peuvent changer la
    // hauteur du document après le premier rendu.
    const timers = [200, 800].map((delai) => window.setTimeout(verifier, delai))
    window.addEventListener('resize', verifier)
    return () => {
      timers.forEach((id) => window.clearTimeout(id))
      window.removeEventListener('resize', verifier)
    }
  }, [contenu])

  useEffect(() => {
    if (!visible) return undefined

    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Toute la plage de scroll de la page remplit la barre.
      const tween = gsap.fromTo(
        rempli.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: 'top',
          ease: 'none',
          scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      )

      return () => {
        tween.scrollTrigger?.kill()
        tween.kill()
      }
    })

    return () => mm.revert()
  }, [visible])

  if (!visible) return null

  return (
    <div className="barre-lecture" aria-hidden="true">
      <span className="barre-lecture__rempli" ref={rempli} />
    </div>
  )
}
