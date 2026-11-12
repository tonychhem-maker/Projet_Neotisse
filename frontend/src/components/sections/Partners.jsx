import { useRef } from 'react'
import { useReveal, useTextReveal } from '../../lib/reveal'

// Section « Nos partenaires ». Les logos viennent du back-office (type
// `partner`) ; à défaut, la grille de repli est affichée.
export default function Partners({ title = ['Nos', 'partenaires'], row1 = [], row2 = [] }) {
  const scope = useRef(null)

  useTextReveal(scope)
  useReveal(scope)

  const hasRows = row1.length > 0 || row2.length > 0

  return (
    <section className="relative" ref={scope}>
      <div className="mx-auto w-full max-w-[1230px] px-10 pb-20 pt-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,400px)_1fr]">
          <h2 className="font-serif text-[28px] uppercase leading-[1.35] text-[#0b4f2a] md:text-[calc(34*var(--u))] lg:text-[calc(46*var(--u))]">
            <span className="reveal-line">
              <span className="block">{title[0]}</span>
            </span>
            <span className="reveal-line">
              <span className="block">{title[1]}</span>
            </span>
          </h2>

          {hasRows && (
            <div data-reveal-group>
              {row1.length > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-8 border-b border-[#0b4f2a]/25 pb-6">
                  {row1.map((logo) => (
                    <img
                      key={logo.name}
                      data-reveal
                      src={logo.src}
                      alt={`Logo ${logo.name}`}
                      style={{ width: `max(96px, calc(${logo.w} * var(--u)))` }}
                      className="h-auto max-w-full object-contain"
                    />
                  ))}
                </div>
              )}
              {row2.length > 0 && (
                <div className="flex flex-wrap items-center justify-start gap-14 border-b border-[#0b4f2a]/25 pb-6 pt-6">
                  {row2.map((logo) => (
                    <img
                      key={logo.name}
                      data-reveal
                      src={logo.src}
                      alt={`Logo ${logo.name}`}
                      style={{ width: `max(96px, calc(${logo.w} * var(--u)))` }}
                      className="h-auto max-w-full object-contain"
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
