import { useRef } from 'react'
import { useReveal, useTextReveal } from '../../lib/reveal'

// Section « Nos partenaires » : bloc pleine largeur fond vert, titre centré
// en blanc, logos alignés horizontalement en dessous. Les logos viennent du
// back-office (type `partner`) ; à défaut, la grille de repli est affichée.
//
// Effet « rideau » au scroll : la section du dessus (les formats d'atelier)
// est en `position: sticky` — quand son bord haut atteint le haut de
// l'écran, elle s'y fige pendant que ce bloc vert, collé à son bord bas,
// continue de monter et la recouvre. La vitesse reste celle du scroll
// (lenis) : aucun saut, aucun espace réservé, aucun blanc ni au-dessus ni
// en dessous. Ce qui suit (CTA final) doit garder un fond opaque pour
// masquer la section figée derrière.
//
// À l'intérieur du bloc, le contenu arrive en cascade (voir `lib/reveal.js`)
// : lignes du titre sous leur masque, puis filet, puis chaque logo.
//
// Les logos fournis sont monochromes noirs : `brightness-0 invert` les rend
// blancs pour rester lisibles sur le fond vert (si un jour un logo coloré est
// téléversé, retirer ce filtre pour le laisser d'origine).
export default function Partners({ title = ['Nos', 'partenaires'], row1 = [], row2 = [] }) {
  const scope = useRef(null)

  useTextReveal(scope)
  useReveal(scope)

  // Une seule rangée horizontale : les deux lignes historiques sont fusionnées
  // (l'ordre des logos est conservé). Le wrap prend le relais sur mobile.
  const logos = [...row1, ...row2]

  return (
    <section className="relative z-10" ref={scope}>
      {/* Bloc vert pleine largeur : aucun conteneur limitant, aucune marge.
          Opaque et toujours visible : c'est lui qui couvre la section
          épinglée pendant la montée — aucun fondu sur le bloc lui-même. */}
      <div className="w-full bg-[#0b4f2a]">
        <div className="mx-auto w-full max-w-[1230px] px-10 py-16 md:py-24">
          <h2 className="text-center font-serif text-[26px] uppercase leading-[1.3] text-white md:text-[calc(30*var(--u))] lg:text-[calc(34*var(--u))]">
            <span className="reveal-line" style={{ '--rv-delay': '0.25s' }}>
              <span className="block">{title[0]}</span>
            </span>
            <span className="reveal-line" style={{ '--rv-delay': '0.35s' }}>
              <span className="block">{title[1]}</span>
            </span>
          </h2>

          {/* Séparation titre / logos : filet blanc discret, centré */}
          <div
            data-reveal
            aria-hidden="true"
            style={{ '--rv-delay': '0.55s' }}
            className="mx-auto mt-8 h-px w-20 bg-white/30 md:mt-10"
          />

          {logos.length > 0 && (
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-14 gap-y-9 md:mt-14 md:gap-x-18">
              {logos.map((logo, index) => (
                <img
                  key={logo.name}
                  data-reveal
                  src={logo.src}
                  alt={`Logo ${logo.name}`}
                  style={{
                    width: `max(88px, calc(${logo.w} * var(--u)))`,
                    '--rv-delay': `${0.7 + index * 0.09}s`,
                  }}
                  className="h-auto max-w-full object-contain opacity-90 brightness-0 invert transition-opacity duration-300 hover:opacity-100"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
