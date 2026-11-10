import { useGSAP } from '@gsap/react'

/**
 * Révélations au scroll des sections « classiques ».
 *
 * Règle du site : seule la hero utilise le scroll « perdu » (pin + scrub
 * pilotés par GSAP). Toutes les autres sections se contentent d'une animation
 * simple, jouée une fois quand l'élément entre dans la fenêtre.
 *
 * Pourquoi pas GSAP ici : ces animations n'ont pas besoin de suivre le scroll
 * au pixel. ScrollTrigger recalculait des positions au chargement, avant que
 * la mise en page soit stable (polices, images, contenu Sanity, hauteur de la
 * hero épinglée). Quand le calcul était périmé, le trigger ne se déclenchait
 * jamais et le contenu restait invisible — le bug constaté au scroll.
 *
 * Ici tout passe par l'IntersectionObserver du navigateur, qui observe la
 * position réelle des éléments et ne dépend d'aucun précalcul : il ne peut pas
 * « rater » un élément. Les états et la transition sont en CSS (voir
 * `index.css`, classes `.rv` / `.reveal-line`), la classe `.is-revealed` est la
 * seule chose ajoutée en JS. Aucun FOUC : l'état de départ n'est appliqué que
 * si le JavaScript s'exécute (classe `.rv-ready` sur `<html>`).
 *
 * `prefers-reduced-motion` : rien n'est masqué ni animé (CSS + garde JS).
 */

const REVEAL_MARGIN = '-12% 0px'

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Observe les éléments sélectionnés dans `root` et leur ajoute
 * `.is-revealed` dès qu'ils entrent dans la fenêtre. Un élément déjà à
 * l'écran au montage est marqué immédiatement, sans animation : on ne fait
 * jamais disparaître un contenu visible.
 *
 * Retourne une fonction de nettoyage.
 */
function observe(root, selector) {
  const targets = [...root.querySelectorAll(selector)]
  if (!targets.length) return () => {}

  const mark = (el) => el.classList.add('is-revealed')

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        mark(entry.target)
        observer.unobserve(entry.target)
      })
    },
    { rootMargin: REVEAL_MARGIN, threshold: 0 },
  )

  targets.forEach((el) => {
    const rect = el.getBoundingClientRect()
    // Déjà dans la fenêtre : visible tout de suite, sans transition.
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('is-instant')
      mark(el)
      return
    }
    observer.observe(el)
  })

  return () => observer.disconnect()
}

/**
 * Active le mode « prêt » des réveils : c'est cette classe qui autorise le CSS
 * à masquer les éléments. Sans JavaScript, rien n'est masqué.
 */
function useRevealRoot(scope) {
  useGSAP(
    () => {
      const root = scope?.current
      if (!root || prefersReducedMotion()) return undefined

      root.classList.add('rv-root')
      return () => root.classList.remove('rv-root')
    },
    { scope },
  )
}

/**
 * Révélation de texte au scroll.
 *
 *   <span class="reveal-line"><span>Ma ligne</span></span>
 *
 * - `.reveal-line` porte `overflow: hidden` (le masque et le réveil) ;
 * - son enfant direct est la ligne animée : elle part sous le masque
 *   (`translateY(105%)`) et remonte à 0.
 *
 * Le texte n'est jamais rendu transparent : il reste dans le DOM, lisible par
 * les moteurs de recherche et les lecteurs d'écran. Seul le masque le cache.
 */
export function useTextReveal(scope) {
  useRevealRoot(scope)

  useGSAP(
    () => {
      const root = scope?.current
      if (!root || prefersReducedMotion()) return undefined
      return observe(root, '.reveal-line')
    },
    { scope },
  )
}

/**
 * Apparition en fondu + montée, pour les éléments non textuels (images,
 * boutons, logos). Même mécanisme que `useTextReveal`.
 *
 *   <div data-reveal>…</div>
 *   <div data-reveal-group><div data-reveal/>…</div>
 *
 * La cascade se règle en CSS avec `style="--rv-delay: 0.1s"`.
 */
export function useReveal(scope) {
  useRevealRoot(scope)

  useGSAP(
    () => {
      const root = scope?.current
      if (!root || prefersReducedMotion()) return undefined
      return observe(root, '[data-reveal]')
    },
    { scope },
  )
}
