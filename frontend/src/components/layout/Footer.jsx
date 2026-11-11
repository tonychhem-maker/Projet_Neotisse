import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { footerNav } from '../../data/navigation'
import logoHeader from '../../assets/ateliers/logo-header.png'
import './Footer.css'
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

// Icônes du pied de page (vert #35985F dans la maquette).
const chevron = (
  <svg viewBox="0 0 13 13" fill="none" aria-hidden="true">
    <path
      d="M4.5 2.5 8.5 6.5 4.5 10.5"
      stroke="#35985F"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const pinIcon = (
  <svg viewBox="0 0 25 25" fill="none" aria-hidden="true">
    <path
      d="M12.5 2.5a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Z"
      fill="#35985F"
    />
    <circle cx="12.5" cy="9.5" r="2.6" fill="#095228" />
  </svg>
)

const mailIcon = (
  <svg viewBox="0 0 25 25" fill="none" aria-hidden="true">
    <rect x="2" y="5" width="21" height="15" rx="1.5" fill="#35985F" />
    <path
      d="m3 6.5 9.5 7 9.5-7"
      stroke="#095228"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const phoneIcon = (
  <svg viewBox="0 0 25 25" fill="none" aria-hidden="true">
    <path
      d="M6.6 3.2 8.9 3a1.6 1.6 0 0 1 1.7 1.1l1 3.2a1.6 1.6 0 0 1-.5 1.7l-1.8 1.4a13.5 13.5 0 0 0 5.3 5.3l1.4-1.8a1.6 1.6 0 0 1 1.7-.5l3.2 1A1.6 1.6 0 0 1 22 16.1l-.2 2.3a2.4 2.4 0 0 1-2.5 2.2C10.5 20 5 14.5 4.4 5.7a2.4 2.4 0 0 1 2.2-2.5Z"
      fill="#35985F"
    />
  </svg>
)

const facebookIcon = (
  <svg viewBox="0 0 15 15" fill="none" aria-hidden="true">
    <path
      d="M8.6 5.2V4c0-.6.4-.7.7-.7h1.5V1h-2.1C6.5 1 6 2.6 6 3.8v1.4H4.4v2.4H6V14h2.6V7.6h1.9l.3-2.4H8.6Z"
      fill="#35985F"
    />
  </svg>
)

const instagramIcon = (
  <svg viewBox="0 0 15 15" fill="none" aria-hidden="true">
    <rect
      x="1.4"
      y="1.4"
      width="12.2"
      height="12.2"
      rx="3.4"
      stroke="#35985F"
      strokeWidth="1.4"
    />
    <circle cx="7.5" cy="7.5" r="2.9" stroke="#35985F" strokeWidth="1.4" />
    <circle cx="11.1" cy="3.9" r="0.9" fill="#35985F" />
  </svg>
)

const socialGlyphs = [
  { match: /facebook/i, glyph: facebookIcon, fallbackHref: 'https://www.facebook.com' },
  { match: /insta/i, glyph: instagramIcon, fallbackHref: 'https://www.instagram.com' },
]

// Repli visuel : les deux pastilles de la maquette tant que le back-office
// ne liste pas de réseaux sociaux.
const socialFallback = [
  { label: 'Facebook', href: 'https://www.facebook.com' },
  { label: 'Instagram', href: 'https://www.instagram.com' },
]

/**
 * Pied de page conforme à la maquette : fond #095228, quatre colonnes
 * (baseline + réseaux, Lien rapide, Blog, Contact), logo blanc détouré
 * en bas à droite, rogné par le bord comme dans la maquette.
 */
export default function Footer() {
  const scope = useRef(null)

  useReveal(scope)

  const settings = useSanityContent(SITE_SETTINGS_QUERY, SETTINGS_FALLBACK)
  const declaredLinks = (settings.socialLinks ?? []).filter((link) => link?.href)
  const socialLinks = declaredLinks.length > 0 ? declaredLinks : socialFallback

  return (
    <footer className="footer cq" ref={scope}>
      <div className="footer__inner">
        {/* Baseline + réseaux sociaux */}
        <div className="footer__intro" data-reveal>
          <p className="footer__baseline">{settings.baseline}</p>
          <ul className="footer__socials">
            {socialLinks.map((link) => {
              const known = socialGlyphs.find((entry) => entry.match.test(link.label ?? ''))
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label || 'Réseau social'}
                    className="footer__social"
                  >
                    {known ? known.glyph : (link.label?.slice(0, 1) ?? '•')}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Lien Rapide */}
        <nav className="footer__col" aria-label="Lien rapide" data-reveal>
          <p className="footer__heading">Lien Rapide</p>
          <ul className="footer__links">
            {footerNav.map((item) => (
              <li key={item.to}>
                <span className="footer__chevron" aria-hidden="true">
                  {chevron}
                </span>
                <Link to={item.to} className="footer__link">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Blog */}
        <div className="footer__col" data-reveal>
          <p className="footer__heading">Blog</p>
          <div className="footer__post">
            <span className="footer__chevron footer__chevron--post" aria-hidden="true">
              {chevron}
            </span>
            <div>
              <Link to="/actualites" className="footer__post-title">
                Festival d’Archéologie Expérimentale d’Occitanie
              </Link>
              <p className="footer__post-date">9-10 octobre 2027</p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="footer__col" data-reveal>
          <p className="footer__heading">Contact</p>
          <ul className="footer__contact">
            <li>
              <span className="footer__icon" aria-hidden="true">
                {pinIcon}
              </span>
              {settings.address}
            </li>
            <li>
              <span className="footer__icon" aria-hidden="true">
                {mailIcon}
              </span>
              <a href={`mailto:${settings.email}`} className="footer__link">
                {settings.email}
              </a>
            </li>
            <li>
              <span className="footer__icon" aria-hidden="true">
                {phoneIcon}
              </span>
              <a href={`tel:${(settings.phone ?? '').replace(/\s/g, '')}`} className="footer__link">
                {settings.phone}
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Logo blanc détouré, rogné par le coin bas-droit comme dans la
          maquette (le fichier est vert : le filtre le passe en blanc). */}
      <img
        src={logoHeader}
        alt=""
        aria-hidden="true"
        className="footer__logo"
        loading="lazy"
      />
    </footer>
  )
}
