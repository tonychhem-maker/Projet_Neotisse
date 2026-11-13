import { useRef } from 'react'
import { useReveal, useTextReveal } from '../../lib/reveal'

// Section « Nos partenaires » : bloc pleine largeur fond vert, titre centré
// en blanc, logos alignés horizontalement en dessous. Les logos viennent du
// back-office (type `partner`) ; à défaut, la grille de repli est affichée.
//
// Entrée progressive au scroll (mécanisme du site, voir `lib/reveal.js`) :
// le bloc vert se dévoile d'abord (fondu + montée), puis les lignes du titre
// remontent sous leur masque, puis le filet, puis chaque logo en cascade
// (`--rv-delay`). Rien n'arrive d'un coup.
//
// Sortie : sous le bloc, un dégradé fond le vert dans le crème du site.
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
    <section className="relative" ref={scope}>
      {/* Bloc vert pleine largeur : aucun conteneur limitant, aucune marge */}
      <div data-reveal className="w-full bg-[#0b4f2a]">
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

      {/* Sortie du vert : fondu progressif vers le fond crème du site.
          Révélé en même temps que le bloc pour ne pas flotter avant lui. */}
      <div
        data-reveal
        aria-hidden="true"
        className="h-20 w-full bg-gradient-to-b from-[#0b4f2a] to-[#F4EFE6] md:h-28"
      />
    </section>
  )
}
