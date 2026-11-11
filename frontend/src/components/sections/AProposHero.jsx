import Fil from '../ui/Fil'
import filDroite from '../../assets/apropos/fil-droite.svg?raw'
import filGauche from '../../assets/apropos/fil-gauche.svg?raw'
import logoUrl from '../../assets/apropos/logo-apropos.png'
import flecheUrl from '../../assets/apropos/fleche.svg?url'
import './AProposHero.css'

/**
 * Bannière de la page À propos, calée sur la maquette (frame « A propos »
 * 424:445, de y80 à y890) : titre centré sur deux lignes, logo tampon au
 * centre, paragraphe d'accroche puis flèche vers le bas.
 *
 * Deux fils textile décorent la bannière : l'un part du bord droit derrière
 * l'en-tête, l'autre longe le bord gauche et passe derrière la grande image
 * de la section suivante. Leurs tracés se dessinent à l'arrivée (composant
 * `Fil`) ; sans JavaScript ni en réduction des mouvements, ils sont
 * entièrement tracés.
 */
export default function AProposHero({ title = '', text = [] }) {
  const lines = String(title).split(/\r?\n/).filter(Boolean)

  return (
    <section className="a-propos-hero" aria-labelledby="a-propos-title">
      <Fil svg={filDroite} className="a-propos-hero__fil a-propos-hero__fil--droite" />
      <Fil svg={filGauche} className="a-propos-hero__fil a-propos-hero__fil--gauche" />

      <h1 className="a-propos-hero__title" id="a-propos-title">
        {lines.map((line) => (
          <span className="a-propos-hero__line" key={line}>
            {line}
          </span>
        ))}
      </h1>

      <img
        className="a-propos-hero__logo"
        src={logoUrl}
        alt=""
        aria-hidden="true"
        loading="eager"
      />

      <div className="a-propos-hero__text">
        {text.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <img className="a-propos-hero__arrow" src={flecheUrl} alt="" aria-hidden="true" />
    </section>
  )
}
