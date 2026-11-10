import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { footerNav } from '../../data/navigation'
import { useReveal } from '../../lib/reveal'
import { SITE_SETTINGS_QUERY, useSanityContent } from '../../lib/queries'

// Coordonnées de repli, affichées tant que « Réglages du site » n'est pas
// renseigné dans le back-office.
const SETTINGS_FALLBACK = {
  baseline:
    'Organiser des activités ludiques et instructives pour toutes les personnes intéressées par le tissage.',
  email: 'asso.neotisse@gmail.com',
  phone: '06 48 65 58 16',
  address: 'Montpellier',
  socialLinks: [],
}

export default function Footer() {
  const scope = useRef(null)

  useReveal(scope, { stagger: 0.1 })

  const settings = useSanityContent(SITE_SETTINGS_QUERY, SETTINGS_FALLBACK)
  const socialLinks = (settings.socialLinks ?? []).filter((link) => link?.href)

  return (
    <footer className="bg-[#0b4f2a] text-[#f4efe6]" ref={scope}>
      {/* Taille de police identique à celle de la navbar. */}
      <div className="mx-auto grid max-w-[1230px] gap-12 px-10 py-16 text-[clamp(0.95rem,1.1vw,1.125rem)] leading-[1.75] sm:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_1.2fr_1fr]">
        {/* Description */}
        <div data-reveal>
          <p className="max-w-[250px]">{settings.baseline}</p>
          {socialLinks.length > 0 && (
            <ul className="mt-6 flex gap-3">
              {socialLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f4efe6] text-[0.8em] font-semibold text-[#0b4f2a] transition-colors hover:bg-[#2f8a55] hover:text-[#f4efe6]"
                  >
                    {link.label?.slice(0, 1)}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Lien Rapide */}
        <nav aria-label="Lien rapide" data-reveal>
          <p className="font-semibold">Lien Rapide</p>
          <ul className="mt-3 space-y-2">
            {footerNav.map((item) => (
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
              {settings.address}
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden="true" className="text-[#2f8a55]">
                ✉
              </span>
              <a
                href={`mailto:${settings.email}`}
                className="hover:text-[#2f8a55]"
              >
                {settings.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden="true" className="text-[#2f8a55]">
                ✆
              </span>
              <a
                href={`tel:${(settings.phone ?? '').replace(/\s/g, '')}`}
                className="hover:text-[#2f8a55]"
              >
                {settings.phone}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
