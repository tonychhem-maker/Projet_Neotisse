import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { siteNav } from '../../data/navigation'

function navLinkClass({ isActive }) {
  return [
    'whitespace-nowrap transition-colors hover:text-leaf',
    isActive ? 'text-pine underline underline-offset-[6px]' : 'text-pine/85',
  ].join(' ')
}

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-pine/10 bg-[#f4efe6]/70 backdrop-blur-md backdrop-saturate-150">
      <div className="mx-auto flex h-[72px] w-full max-w-[1440px] items-center gap-6 px-10">
        <Link
          to="/"
          aria-label="Neotisse — accueil"
          className="flex shrink-0 flex-col items-center leading-none"
        >
          <img
            src="/assets/logos/neotisse.png"
            alt=""
            className="h-14 w-auto object-contain"
          />
          <span className="mt-0.5 text-[8px] uppercase tracking-[0.2em] text-pine">
            Neotisse
          </span>
        </Link>

        {/* Les liens occupent l'espace restant et restent sur une seule ligne :
            la nav prend la place disponible plutôt que de déborder. */}
        <nav aria-label="Navigation principale" className="hidden min-w-0 flex-1 lg:block">
          <ul className="flex items-center justify-center gap-x-[clamp(1rem,2.2vw,2.5rem)] text-[clamp(0.95rem,1.1vw,1.125rem)]">
            {siteNav.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} className={navLinkClass}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Réserve une place symétrique au logo pour que la nav soit centrée */}
        <span aria-hidden="true" className="hidden w-[104px] shrink-0 lg:block" />

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          className="ml-auto rounded p-2 lg:hidden"
        >
          <span className="block h-0.5 w-6 bg-pine" />
          <span className="mt-1.5 block h-0.5 w-6 bg-pine" />
          <span className="mt-1.5 block h-0.5 w-6 bg-pine" />
        </button>
      </div>

      {open && (
        <nav
          id="menu-mobile"
          aria-label="Navigation mobile"
          className="border-t border-pine/10 bg-[#f4efe6]/70 px-10 pb-6 backdrop-blur-md lg:hidden"
        >
          <ul className="flex flex-col gap-4 pt-4 text-[15px]">
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
