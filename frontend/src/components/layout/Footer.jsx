import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useReveal } from '../../lib/reveal'

const quickLinks = [
  { label: 'Accueil', to: '/' },
  { label: 'Ateliers', to: '/ateliers-de-mediation-textile' },
  { label: 'À Propos', to: '/a-propos' },
  { label: 'Contact', to: '/contact' },
]

export default function Footer() {
  const scope = useRef(null)

  useReveal(scope, { stagger: 0.1 })

  return (
    <footer className="bg-[#0b4f2a] text-[#f4efe6]" ref={scope}>
      {/* Taille de police identique à celle de la navbar. */}
      <div className="mx-auto grid max-w-[1230px] gap-12 px-10 py-16 text-[clamp(0.95rem,1.1vw,1.125rem)] leading-[1.75] sm:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_1.2fr_1fr]">
        {/* Description */}
        <div data-reveal>
          <p className="max-w-[250px]">
            Organiser des activités ludiques et instructives pour toutes les
            personnes intéressées par le tissage.
          </p>
          <div className="mt-6 flex gap-3">
            {['f', 'x'].map((glyph) => (
              <span
                key={glyph}
                aria-hidden="true"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f4efe6] text-[0.8em] font-semibold text-[#0b4f2a]"
              >
                {glyph}
              </span>
            ))}
          </div>
        </div>

        {/* Lien Rapide */}
        <nav aria-label="Lien rapide" data-reveal>
          <p className="font-semibold">Lien Rapide</p>
          <ul className="mt-3 space-y-2">
            {quickLinks.map((item) => (
              <li key={item.to} className="flex items-start gap-2">
                <span aria-hidden="true" className="text-[#2f8a55]">
                  ›
                </span>
                <Link to={item.to} className="transition-colors hover:text-[#2f8a55]">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Blog */}
        <div data-reveal>
          <p className="font-semibold">Blog</p>
          <div className="mt-3 flex items-start gap-2">
            <span aria-hidden="true" className="text-[#2f8a55]">
              ›
            </span>
            <div>
              <Link
                to="/actualites"
                className="underline decoration-[#2f8a55] underline-offset-2 transition-colors hover:text-[#2f8a55]"
              >
                Festival D’Archéologie Expérimentale D’Occitanie
              </Link>
              <p className="mt-1 text-[0.85em]">9-10 octobre 2027</p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div data-reveal>
          <p className="font-semibold">Contact</p>
          <ul className="mt-3 space-y-2">
            <li className="flex items-center gap-2">
              <span aria-hidden="true" className="text-[#2f8a55]">
                ⌖
              </span>
              Montpellier
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden="true" className="text-[#2f8a55]">
                ✉
              </span>
              <a href="mailto:asso.neotisse@gmail.com" className="hover:text-[#2f8a55]">
                asso.neotisse@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden="true" className="text-[#2f8a55]">
                ✆
              </span>
              <a href="tel:+33648655816" className="hover:text-[#2f8a55]">
                06 48 65 58 16
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
