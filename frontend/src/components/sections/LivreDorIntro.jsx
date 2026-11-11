import { useState } from 'react'
import Honeypot from '../ui/Honeypot'
import { isContactFormConfigured, sendTestimonial } from '../../lib/forms'
import './LivreDorIntro.css'

const emptyForm = { nom: '', prenom: '', message: '', honeypot: '' }

/**
 Bloc supérieur de la page Livre d'or, calé sur la maquette (frame
 « Livre d'or » 424:684, de y80 à y1079) :

 - à gauche : le titre (64px, x53 y185), le filet (457px, épaisseur 3px,
   y370), le témoignage vedette (18/30, x53 y394) puis le bloc auteur
   (portrait 74px + nom 24px, y719, collé en bas de la colonne) ;
 - à droite : le formulaire « partagez votre avis » (32px, x871 y215), deux
   champs « nom » et « Prénom » (libellé 16px + soulignement), la zone de
   message (532×368, x844 y504, sable à 71 %) et le bouton « Poster mon
   avis » (249×53, centré sous la zone de message).

 Les dimensions desktop sont en `cqw` (px/14.4 sur la maquette 1440).
 Aucun contenu n'est masqué par défaut : sans JavaScript, le formulaire
 affiche ses champs et le bouton d'envoi natif.
 */
export default function LivreDorIntro({ title = '', sectionTitle = '', featured = {} }) {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')

  function update(key) {
    return (event) => {
      const value = event.target.value
      setForm((current) => ({ ...current, [key]: value }))
      if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }))
    }
  }

  function validate() {
    const next = {}
    if (!form.nom.trim() && !form.prenom.trim()) {
      next.nom = 'Merci d’indiquer votre nom ou prénom.'
    }
    if (form.message.trim().length < 10) {
      next.message = 'Merci d’écrire au moins quelques mots (10 caractères minimum).'
    }
    return next
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length > 0) return

    if (form.honeypot) {
      setStatus('success')
      return
    }

    setStatus('sending')
    try {
      await sendTestimonial({
        author: [form.prenom.trim(), form.nom.trim()].filter(Boolean).join(' '),
        message: form.message,
      })
      setStatus('success')
      setForm(emptyForm)
    } catch {
      setStatus('error')
    }
  }

  const avatar = featured.avatar?.src

  return (
    <section className="livre-dor-intro" aria-labelledby="livre-dor-title">
      <div className="livre-dor-intro__left">
        <h1 className="livre-dor-intro__title" id="livre-dor-title">
          {title}
        </h1>
        <div className="livre-dor-intro__rule" aria-hidden="true" />
        {featured.message && (
          <blockquote className="livre-dor-intro__quote">
            <p>{featured.message}</p>
          </blockquote>
        )}
        {featured.author && (
          <figure className="livre-dor-intro__author">
            {avatar ? (
              <img
                className="livre-dor-intro__avatar"
                src={avatar}
                alt={featured.avatar.alt || ''}
              />
            ) : (
              <span className="livre-dor-intro__avatar livre-dor-intro__avatar--placeholder" aria-hidden="true" />
            )}
            <figcaption className="livre-dor-intro__name">
              {featured.author}
              {featured.organisation ? ` — ${featured.organisation}` : ''}
            </figcaption>
          </figure>
        )}
      </div>

      <form className="livre-dor-intro__form" onSubmit={handleSubmit} noValidate>
        <h2 className="livre-dor-intro__form-title">{sectionTitle}</h2>

        <div className="livre-dor-intro__field">
          <label className="livre-dor-intro__label" htmlFor="livre-dor-nom">
            nom
          </label>
          <input
            className="livre-dor-intro__input"
            id="livre-dor-nom"
            name="nom"
            type="text"
            autoComplete="family-name"
            value={form.nom}
            onChange={update('nom')}
            aria-invalid={errors.nom ? true : undefined}
          />
          {errors.nom && <p className="livre-dor-intro__error">{errors.nom}</p>}
        </div>

        <div className="livre-dor-intro__field livre-dor-intro__field--second">
          <label className="livre-dor-intro__label" htmlFor="livre-dor-prenom">
            Prénom
          </label>
          <input
            className="livre-dor-intro__input"
            id="livre-dor-prenom"
            name="prenom"
            type="text"
            autoComplete="given-name"
            value={form.prenom}
            onChange={update('prenom')}
          />
        </div>

        <div className="livre-dor-intro__message-wrap">
          <label className="livre-dor-intro__label livre-dor-intro__label--sr" htmlFor="livre-dor-message">
            Votre message
          </label>
          <textarea
            className="livre-dor-intro__message"
            id="livre-dor-message"
            name="message"
            rows={8}
            placeholder="Votre message"
            value={form.message}
            onChange={update('message')}
            aria-invalid={errors.message ? true : undefined}
          />
          {errors.message && <p className="livre-dor-intro__error">{errors.message}</p>}
        </div>

        {!isContactFormConfigured && (
          <p className="livre-dor-intro__notice">
            Le formulaire n’est pas encore relié à un service d’envoi. Renseignez
            <code>VITE_TESTIMONIAL_FORM_ENDPOINT</code>.
          </p>
        )}

        {status === 'success' && (
          <p role="status" className="livre-dor-intro__status">
            Merci pour votre message ! Il sera relu par l’équipe avant d’être publié
            dans le livre d’or.
          </p>
        )}
        {status === 'error' && (
          <p role="alert" className="livre-dor-intro__error">
            L’envoi a échoué. Merci de réessayer plus tard.
          </p>
        )}

        <button className="livre-dor-intro__submit" type="submit" disabled={status === 'sending'} aria-busy={status === 'sending'}>
          {status === 'sending' ? 'Envoi en cours…' : 'Poster mon avis'}
        </button>

        <Honeypot
          value={form.honeypot}
          onChange={(value) => setForm((current) => ({ ...current, honeypot: value }))}
        />
      </form>
    </section>
  )
}
