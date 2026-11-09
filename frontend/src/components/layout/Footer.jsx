import { Link } from 'react-router-dom'
import { legalNav, siteNav } from '../../data/navigation'

// Calculé au chargement du module : évite un appel impur pendant le rendu.
const YEAR = new Date().getFullYear()


export default function Footer() {
  return (
    <footer className="mt-24 bg-pine text-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <p className="font-serif text-2xl">Neotisse</p>
          <p className="mt-4 max-w-xs text-sm text-cream/80">
            Ateliers de médiation textile autour du tissage, du néolithique au Moyen Âge.
          </p>
        </div>

        <nav aria-label="Plan du site">
          <p className="text-sm font-bold uppercase tracking-widest text-sand">Le site</p>
          <ul className="mt-4 space-y-2 text-sm">
            {siteNav.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="transition-colors hover:text-leaf">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/contact" className="transition-colors hover:text-leaf">
                Contactez-nous
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Informations légales">
          <p className="text-sm font-bold uppercase tracking-widest text-sand">Informations</p>
          <ul className="mt-4 space-y-2 text-sm">
            {legalNav.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="transition-colors hover:text-leaf">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-cream/20">
        <p className="mx-auto max-w-7xl px-4 py-6 text-xs text-cream/70 sm:px-6 lg:px-8">
          © {YEAR} Neotisse. Tous droits réservés.
        </p>
      </div>
    </footer>
  )
}
