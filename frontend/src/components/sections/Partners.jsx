import { useRef } from 'react'
import { useReveal } from '../../lib/reveal'

const PARTENAIRES_ROW_1 = [
  { name: 'Gergovie', src: '/assets/logos/gergovie.png', w: 210 },
  { name: 'Lozère Tourisme', src: '/assets/logos/lozere.png', w: 135 },
  { name: 'CERAC', src: '/assets/logos/cerac.png', w: 70 },
]

const PARTENAIRES_ROW_2 = [
  { name: 'Musée de Tautavel', src: '/assets/logos/tautavel.png', w: 215 },
  { name: 'Festival du Lin', src: '/assets/logos/festival-lin.png', w: 140 },
]

export default function Partners() {
  const scope = useRef(null)

  useReveal(scope, { stagger: 0.08 })

  return (
    <section className="relative" ref={scope}>
      <div className="mx-auto w-full max-w-[1230px] px-10 pb-20 pt-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,400px)_1fr]">
          <h2
            data-reveal
            className="font-serif text-[34px] uppercase leading-[1.12] text-[#0b4f2a] lg:text-[46px]"
          >
            Nos
            <br />
            partenaires
          </h2>

          <div data-reveal-group>
            <div className="flex flex-wrap items-center justify-between gap-8 border-b border-[#0b4f2a]/25 pb-6">
              {PARTENAIRES_ROW_1.map((logo) => (
                <img
                  key={logo.name}
                  data-reveal
                  src={logo.src}
                  alt={`Logo ${logo.name}`}
                  style={{ width: logo.w }}
                  className="h-auto max-w-full object-contain"
                />
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-start gap-14 border-b border-[#0b4f2a]/25 pb-6 pt-6">
              {PARTENAIRES_ROW_2.map((logo) => (
                <img
                  key={logo.name}
                  data-reveal
                  src={logo.src}
                  alt={`Logo ${logo.name}`}
                  style={{ width: logo.w }}
                  className="h-auto max-w-full object-contain"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
