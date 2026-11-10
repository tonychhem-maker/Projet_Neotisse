import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { siteNav } from '../../data/navigation'

function navLinkClass({ isActive }) {
  return [
    'transition-colors hover:text-leaf',
    isActive ? 'text-leaf underline underline-offset-8' : 'text-cream',
  ].join(' ')
}

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-pine text-cream shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="font-serif text-2xl tracking-wide">
          Neotisse
        </Link>

        <nav aria-label="Navigation principale" className="hidden lg:block">
          <ul className="flex items-center gap-6 text-sm">
            {siteNav.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} className={navLinkClass}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            className="rounded-md p-2 lg:hidden"
          >
            <span className="block h-0.5 w-6 bg-cream" />
            <span className="mt-1.5 block h-0.5 w-6 bg-cream" />
            <span className="mt-1.5 block h-0.5 w-6 bg-cream" />
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="menu-mobile"
          aria-label="Navigation mobile"
          className="border-t border-cream/20 px-4 pb-6 lg:hidden"
        >
          <ul className="flex flex-col gap-4 pt-4 text-sm">
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
