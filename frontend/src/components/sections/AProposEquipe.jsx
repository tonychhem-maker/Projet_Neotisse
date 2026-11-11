import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useReveal, useTextReveal } from '../../lib/reveal'
import Fil from '../ui/Fil'
import filMilieu1 from '../../assets/apropos/fil-milieu-1.svg?raw'
import filMilieu2 from '../../assets/apropos/fil-milieu-2.svg?raw'
import flecheUrl from '../../assets/apropos/fleche.svg?url'
import './AProposEquipe.css'

/**
 * Section « équipe » de la page À propos, calée sur la maquette : une liste
 * de membres, chacun avec sa photo à gauche (411×592), son nom et sa fonction
 * au centre, sa biographie à droite. Deux fils textile traversent la section
 * derrière les photos.
 *
 * Sous la liste, une flèche et un lien « voir plus sur nos collaborateur ».
 */
export default function AProposEquipe({ members = [], moreLink }) {
  const scope = useRef(null)

  useTextReveal(scope)
  useReveal(scope)

  if (!members.length) return null

  return (
    <section className="a-propos-equipe" ref={scope} aria-label="L’équipe">
      <Fil svg={filMilieu1} className="a-propos-equipe__fil a-propos-equipe__fil--un" />
      <Fil svg={filMilieu2} className="a-propos-equipe__fil a-propos-equipe__fil--deux" />

      {members.map((member) => (
        <article className="a-propos-member" key={member.id ?? member.name}>
          <figure className="a-propos-member__figure" data-reveal>
            {member.photo?.src && (
              <img
                src={member.photo.src}
                alt={member.photo.alt ?? member.name ?? ''}
                loading="lazy"
              />
            )}
          </figure>

          <header className="a-propos-member__heading">
            <h3 className="a-propos-member__name">
              <span className="reveal-line">
                <span className="block">{member.name}</span>
              </span>
            </h3>
            {member.role && (
              <p className="a-propos-member__role">
                <span className="reveal-line">
                  <span className="block">{member.role}</span>
                </span>
              </p>
            )}
          </header>

          {member.bio && (
            <p className="a-propos-member__bio">
              <span className="reveal-line">
                <span className="block">{member.bio}</span>
              </span>
            </p>
          )}
        </article>
      ))}

      {moreLink?.label && (
        <div className="a-propos-equipe__more" data-reveal>
          <img className="a-propos-equipe__arrow" src={flecheUrl} alt="" aria-hidden="true" />
          <Link className="a-propos-equipe__link" to={moreLink.to ?? '/contact'}>
            {moreLink.label}
          </Link>
        </div>
      )}
    </section>
  )
}
