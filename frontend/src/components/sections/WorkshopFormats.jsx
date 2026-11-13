import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger, gsap } from '../../lib/smoothScroll'
import { useReveal, useTextReveal } from '../../lib/reveal'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * Section des formats d'atelier (accordéon).
 *
 * Les formats viennent du back-office (`workshopFormat`), avec repli codé en
 * dur ; chaque entrée porte `id`, `title`, `text`, `image` et un `link`
 * facultatif. L'accordéon reste monté : ouverture et fermeture sont animées
 * en hauteur (mesurée), pour une transition douce et réversible.
 */
export default function WorkshopFormats({ formats = [], defaultOpen = null }) {
  const [openFormat, setOpenFormat] = useState(defaultOpen)
  const scope = useRef(null)
  const panelRefs = useRef({})
  const firstRun = useRef(true)

  useReveal(scope)
  useTextReveal(scope)

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches

      formats.forEach((format) => {
        const panel = panelRefs.current[format.id]
        if (!panel) return

        const open = openFormat === format.id
        const inner = panel.firstElementChild

        if (prefersReducedMotion || firstRun.current) {
          gsap.set(panel, { height: open ? 'auto' : 0, autoAlpha: open ? 1 : 0 })
          return
        }

        gsap.killTweensOf([panel, inner])

        // `height: auto` n'est pas interpolable : on mesure la hauteur réelle
        // avant d'animer, puis on la remet à `auto` une fois ouverte.
        if (open) {
          const target = inner.offsetHeight
          gsap.fromTo(
            panel,
            { height: 0, autoAlpha: 0 },
            {
              height: target,
              autoAlpha: 1,
              duration: 0.6,
              ease: 'expo.inOut',
              overwrite: true,
              onComplete: () => gsap.set(panel, { height: 'auto' }),
            },
          )
          gsap.fromTo(
            inner,
            { y: 18 },
            { y: 0, duration: 0.8, ease: 'expo.out', overwrite: true },
          )
        } else {
          gsap.to(panel, {
            height: 0,
            autoAlpha: 0,
            duration: 0.5,
            ease: 'expo.inOut',
            overwrite: true,
          })
        }
      })

      firstRun.current = false
    },
    { dependencies: [openFormat, formats], scope },
  )

  return (
    <section className="relative" ref={scope}>
      <div className="mx-auto w-full max-w-[1230px] px-10 pb-16">
        <ul>
          {formats.map((format) => {
            const open = openFormat === format.id
            return (
              <li key={format.id} data-reveal>
                <button
                  type="button"
                  onClick={() => setOpenFormat(open ? null : format.id)}
                  aria-expanded={open}
                  aria-controls={`format-panel-${format.id}`}
                  className="group flex w-full items-center justify-between border-t border-[#0b4f2a]/70 pt-4 pb-3 text-left"
                >
                  <span className="flex items-baseline gap-9">
                    <span className="font-sans text-[14px] text-[#2f8a55] md:text-[calc(16*var(--u))]">
                      {format.id}
                    </span>
                    <span className="reveal-line font-serif text-[20px] uppercase leading-[1.15] text-[#0b4f2a] transition-colors duration-300 group-hover:text-[#2f8a55] md:text-[calc(24*var(--u))] lg:text-[calc(26*var(--u))]">
                      <span className="block">{format.title}</span>
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-[16px] text-[#2f8a55] transition-transform duration-500 md:text-[calc(20*var(--u))]"
                    style={{ transform: open ? 'rotate(180deg)' : 'none' }}
                  >
                    ↑
                  </span>
                </button>

                <div
                  id={`format-panel-${format.id}`}
                  ref={(el) => {
                    panelRefs.current[format.id] = el
                  }}
                  className="overflow-hidden"
                >
                  <div className="grid items-start gap-10 pb-10 pl-0 md:grid-cols-[1fr_calc(300*var(--u))] md:pl-12">
                    <div className="order-2 pt-4 md:order-1">
                      <p className="reveal-line max-w-[600px] text-[14px] leading-[1.9] text-[#0a0a0a] md:text-[calc(17*var(--u))]">
                        <span className="block">{format.text}</span>
                      </p>
                      <Link
                        to={format.link ?? '/contact'}
                        className="mt-6 inline-flex items-center gap-2 text-[12px] font-medium text-[#0a0a0a] underline underline-offset-4 md:text-[calc(13*var(--u))]"
                      >
                        CONTACTEZ-NOUS
                        <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                    {format.image && (
                      <img
                        src={format.image}
                        alt=""
                        className="order-1 h-[200px] w-[240px] max-w-full object-cover md:order-2 md:h-[calc(250*var(--u))] md:w-[calc(300*var(--u))] md:justify-self-end"
                      />
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
