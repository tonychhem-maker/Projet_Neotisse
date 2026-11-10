import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger, gsap } from '../../lib/smoothScroll'
import { useReveal } from '../../lib/reveal'

gsap.registerPlugin(ScrollTrigger, useGSAP)

// Les quatre formats d'ateliers proposés par Neotisse. Le contenu est commun
// à l'accueil et à la page Ateliers (maquette Figma) : seule chaque image
// d'illustration change d'une section à l'autre.
export const FORMATS = [
  {
    id: '01',
    title: 'DÉMONSTRATIF',
    image: '/assets/images/tissage-fleche.jpg',
    text: 'La démonstration s’installe dans votre structure : gestes, matières et outils sont présentés au public, qui peut observer le travail de près et poser ses questions.',
  },
  {
    id: '02',
    title: 'PARTICIPATIF',
    image: '/assets/images/tissage-tablettes.jpg',
    text: 'Le public passe de l’observation à la pratique : chacun apprend un geste textile simple, sur un métier ou une tablette, et repart avec sa réalisation.',
  },
  {
    id: '03',
    title: 'POUR ENFANTS',
    image: '/assets/images/tissage-tablettes.jpg',
    text: 'Des ateliers courts et ludiques, adaptés aux plus jeunes, pour découvrir les gestes du tissage et l’histoire des textiles anciens en s’amusant.',
  },
  {
    id: '04',
    title: 'SUR MESURE',
    image: '/assets/images/filage-fuseau.jpg',
    text: 'Parlons de votre projet ensemble, Neotisse vous propose d’organiser un atelier à votre image pour vos besoins',
  },
]

export default function WorkshopFormats({ defaultOpen = null }) {
  const [openFormat, setOpenFormat] = useState(defaultOpen)
  const scope = useRef(null)
  const panelRefs = useRef({})
  const firstRun = useRef(true)

  useReveal(scope, { stagger: 0.1 })

  // Ouverture / fermeture fluide : la hauteur est animée, pas le montage.
  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches

      FORMATS.forEach((format) => {
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
    { dependencies: [openFormat], scope },
  )

  return (
    <section className="relative" ref={scope}>
      <div className="mx-auto w-full max-w-[1230px] px-10 pb-16">
        <ul>
          {FORMATS.map((format) => {
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
                    <span className="font-sans text-[20px] text-[#2f8a55]">
                      {format.id}
                    </span>
                    <span className="font-serif text-[30px] leading-[1.15] text-[#0b4f2a] transition-colors duration-300 group-hover:text-[#2f8a55] lg:text-[34px]">
                      {format.title}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-[22px] text-[#2f8a55] transition-transform duration-500"
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
                  <div className="grid items-start gap-10 pb-10 pl-0 md:grid-cols-[300px_1fr] md:pl-12">
                    <img
                      src={format.image}
                      alt=""
                      className="h-[250px] w-[300px] max-w-full object-cover"
                    />
                    <div className="pt-4">
                      <p className="max-w-[300px] text-[12px] leading-[1.9] text-[#0a0a0a]">
                        {format.text}
                      </p>
                      <Link
                        to="/contact"
                        className="mt-6 inline-flex items-center gap-2 text-[12px] font-medium text-[#0a0a0a] underline underline-offset-4"
                      >
                        CONTACTEZ-NOUS
                        <span aria-hidden="true">→</span>
                      </Link>
                    </div>
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
