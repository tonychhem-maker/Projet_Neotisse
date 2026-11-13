import { useEffect, useMemo, useRef, useState } from 'react'
import Honeypot from '../ui/Honeypot'
import { BoutonEnvoyer, ChampLong, ChampTexte } from '../ui/Formulaire'
import { gsap } from '../../lib/smoothScroll'
import { isContactFormConfigured, sendTestimonial } from '../../lib/forms'
import './LivreDorIntro.css'

const emptyForm = { nom: '', prenom: '', message: '', honeypot: '' }

const DELAI_AUTO = 6000 // défilement automatique : un avis toutes les 6 s

/**
 Bloc supérieur de la page Livre d'or, calé sur la maquette (frame
 « Livre d'or » 424:684, de y80 à y1079) :

 - à gauche : le titre (64px, x53 y185), le filet (457px, épaisseur 3px,
   y370), les flèches précédent/suivant, le témoignage vedette (18/30, x53
   y394) puis le bloc auteur (portrait 74px + nom 24px, y719, collé en bas
   de la colonne) ;
 - à droite : le formulaire « partagez votre avis » (32px, x871 y215), deux
   champs « nom » et « Prénom » (libellé 16px + soulignement), la zone de
   message (532×368, x844 y504, sable à 71 %) et le bouton « Poster mon
   avis » (249×53, centré sous la zone de message).

 Les dimensions desktop sont en `cqw` (px/14.4 sur la maquette 1440).
 Aucun contenu n'est masqué par défaut : sans JavaScript, le formulaire
 affiche ses champs et le bouton d'envoi natif, la vedette reste affichée.

 Le témoignage vedette est le premier avis d'une petite galerie : suivent
 les témoignages publiés (contenus fictifs de repli tant que le back-office
 n'est pas rempli, dédoublonnés d'avec la vedette). Les flèches passent
 d'un avis à l'autre ; sans interaction, le défilement est automatique
 (toutes les 6 s), suspendu au survol et au focus, et désactivé en
 réduction des mouvements. La transition GSAP (fondu + montée) ne touche
 que l'opacité et la transformation.
 */
export default function LivreDorIntro({
  title = '',
  sectionTitle = '',
  featured = {},
  testimonials = [],
}) {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')

  // Galerie d'avis : la vedette d'abord, puis les témoignages publiés. Les
  // doublons exacts (même auteur, même message) sont retirés — le repli
  // fictif reprend volontairement le texte de la vedette en première carte.
  const slides = useMemo(() => {
    const list = [featured, ...testimonials].filter(
      (a) => a && (a.message || a.author),
    )
    const vus = new Set()
    return list.filter((a) => {
      const cle = `${a.author ?? ''}|${a.message ?? ''}`
      if (vus.has(cle)) return false
      vus.add(cle)
      return true
    })
  }, [featured, testimonials])

  const [index, setIndex] = useState(0)
  const count = slides.length
  const current = count > 0 ? index % count : 0
  const slide = slides[current] ?? {}

  const survolRef = useRef(false)
  const slideRef = useRef(null)
  const premierRenduRef = useRef(true)

  function avisPrecedent() {
    setIndex((i) => (i - 1 + count) % count)
  }

  function avisSuivant() {
    setIndex((i) => (i + 1) % count)
  }

  // Défilement automatique. L'effet redémarre à chaque changement d'avis :
  // les 6 s sont comptées depuis le dernier avis affiché, manuel ou auto.
  useEffect(() => {
    if (count < 2) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined
    }

    const id = window.setInterval(() => {
      if (!survolRef.current && !document.hidden) {
        setIndex((i) => (i + 1) % count)
      }
    }, DELAI_AUTO)

    return () => window.clearInterval(id)
  }, [count, index])

  // Transition d'un avis à l'autre (fondu + montée). Saute le premier
  // rendu : la vedette est visible immédiatement, sans fondu d'entrée.
  useEffect(() => {
    const el = slideRef.current
    if (!el) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined
    }
    if (premierRenduRef.current) {
      premierRenduRef.current = false
      return undefined
    }

    const tween = gsap.fromTo(
      el,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
    )
    return () => {
      tween.kill()
      gsap.set(el, { clearProps: 'opacity,transform' })
    }
  }, [current])

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

  const avatar = slide.avatar?.src

  return (
    <section className="livre-dor-intro" aria-labelledby="livre-dor-title">
      {/* Le survol et le focus dans la colonne suspendent le défilement
          automatique (focus et blur se propagent via focusin/focusout). */}
      <div
        className="livre-dor-intro__left"
        onMouseEnter={() => {
          survolRef.current = true
        }}
        onMouseLeave={() => {
          survolRef.current = false
        }}
        onFocus={() => {
          survolRef.current = true
        }}
        onBlur={() => {
          survolRef.current = false
        }}
      >
        <h1 className="livre-dor-intro__title" id="livre-dor-title">
          {title}
        </h1>
        <div className="livre-dor-intro__rule" aria-hidden="true" />

        {count > 1 && (
          <nav className="livre-dor-intro__nav" aria-label="Naviguer entre les avis">
            <button
              type="button"
              className="livre-dor-intro__nav-btn livre-dor-intro__nav-btn--prev"
              aria-label="Avis précédent"
              onClick={avisPrecedent}
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M20 12H5m0 0 6-6m-6 6 6 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              className="livre-dor-intro__nav-btn"
              aria-label="Avis suivant"
              onClick={avisSuivant}
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M4 12h15m0 0-6-6m6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </nav>
        )}

        <div
          ref={slideRef}
          className="livre-dor-intro__slide"
          role="group"
          aria-roledescription="témoignage"
          aria-label={count > 1 ? `Avis ${current + 1} sur ${count}` : undefined}
        >
          {slide.message && (
            <blockquote className="livre-dor-intro__quote">
              <p>{slide.message}</p>
            </blockquote>
          )}
          {slide.author && (
            <figure className="livre-dor-intro__author">
              {avatar ? (
                <img
                  className="livre-dor-intro__avatar"
                  src={avatar}
                  alt={slide.avatar.alt || ''}
                />
              ) : (
                <span className="livre-dor-intro__avatar livre-dor-intro__avatar--placeholder" aria-hidden="true" />
              )}
              <figcaption className="livre-dor-intro__name">
                {slide.author}
                {slide.organisation ? ` — ${slide.organisation}` : ''}
              </figcaption>
            </figure>
          )}
        </div>
      </div>

      <form className="livre-dor-intro__form" onSubmit={handleSubmit} noValidate>
        <h2 className="livre-dor-intro__form-title">{sectionTitle}</h2>

        <div className="mt-6 flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <ChampTexte
              label="Nom"
              id="livre-dor-nom"
              name="nom"
              autoComplete="family-name"
              placeholder="Votre nom"
              value={form.nom}
              onChange={update('nom')}
              erreur={errors.nom}
            />
            <ChampTexte
              label="Prénom"
              id="livre-dor-prenom"
              name="prenom"
              autoComplete="given-name"
              placeholder="Votre prénom"
              value={form.prenom}
              onChange={update('prenom')}
              erreur={errors.prenom}
            />
          </div>

          <ChampLong
            label="Votre message"
            id="livre-dor-message"
            name="message"
            rows={7}
            placeholder="Partagez votre expérience avec Neotisse…"
            value={form.message}
            onChange={update('message')}
            erreur={errors.message}
          />

          {!isContactFormConfigured && (
            <p className="border border-[#e4dcce] bg-[#e4dcce]/40 px-4 py-3 text-[14px] text-[#095228]">
              Le formulaire n’est pas encore relié à un service d’envoi. Renseignez
              <code className="bg-[#f4efe6] px-1">VITE_TESTIMONIAL_FORM_ENDPOINT</code>.
            </p>
          )}

          {status === 'success' && (
            <p role="status" className="border border-[#35985f] px-4 py-3 text-[14px] text-[#095228]">
              Merci pour votre message ! Il sera relu par l’équipe avant d’être publié
              dans le livre d’or.
            </p>
          )}
          {status === 'error' && (
            <p role="alert" className="text-[14px] text-[#b42318]">
              L’envoi a échoué. Merci de réessayer plus tard.
            </p>
          )}

          <BoutonEnvoyer disabled={status === 'sending'} aria-busy={status === 'sending'}>
            {status === 'sending' ? 'Envoi en cours…' : 'Poster mon avis'}
          </BoutonEnvoyer>

          <Honeypot
            value={form.honeypot}
            onChange={(value) => setForm((current) => ({ ...current, honeypot: value }))}
          />
        </div>
      </form>
    </section>
  )
}
