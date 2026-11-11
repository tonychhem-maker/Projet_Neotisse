import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import logoHeader from '../../assets/ateliers/logo-header.png'
import { siteNav } from '../../data/navigation'
import './Header.css'

function navLinkClass({ isActive }) {
  return isActive ? 'is-active' : undefined
}

/**
 * En-tête conforme à la maquette : 80px de haut (5.5556cqw), logo 74×73 à
 * 30px du bord, nav répartie sur 941px en DM Sans 21px, à 160px du logo.
 * Comme la page Ateliers, il se met à l'échelle homothétiquement (le pied de
 * page et les sections utilisent la même unité `cqw`).
 */
export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="site-header cq">
      <div className="site-header__inner">
        <Link to="/" aria-label="Neotisse — accueil" className="site-header__logo">
          <img src={logoHeader} alt="" width="74" height="73" />
        </Link>

        <nav aria-label="Navigation principale" className="site-header__nav">
          <ul>
            {siteNav.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} className={navLinkClass}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          className="site-header__burger"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {open && (
        <nav
          id="menu-mobile"
          aria-label="Navigation mobile"
          className="site-header__mobile"
        >
          <ul>
            {siteNav.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={navLinkClass}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
