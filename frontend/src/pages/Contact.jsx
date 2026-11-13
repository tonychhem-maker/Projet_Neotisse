import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger, gsap } from '../lib/smoothScroll'
import { isContactFormConfigured, sendContactMessage, validateEmail } from '../lib/forms'
import { CONTACT_QUERY, useSanityContent } from '../lib/queries'
import {
  BoutonEnvoyer,
  CaseCocher,
  ChampLong,
  ChampSelect,
  ChampTexte,
  Formulaire,
} from '../components/ui/Formulaire'
import './Contact.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

// Contenu de repli, affiché tant que la page Contact n'est pas renseignée
// dans le back-office.
const CONTACT_FALLBACK = {
  title: 'Contactez-nous',
  intro:
    'Nous sommes ravies d’échanger avec vous afin de concevoir une intervention adaptée à votre projet, à vos publics et à vos besoins',
  email: 'asso.neotisse@gmail.com',
  phone: '06 48 65 58 16',
  address: 'Montpellier',
  instagram: '@neotisse.asso',
  formSuccessMessage:
    'Merci ! Votre message a bien été envoyé, nous vous répondrons rapidement.',
}

const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  subject: '',
  message: '',
  consent: false,
  honeypot: '',
}

// Objets proposés dans le menu déroulant « objet de contact ».
const OBJETS = [
  'Organiser un atelier',
  'Demander des informations',
  'Proposition de partenariat',
  'Invitation à un événement',
  'Presse & médias',
  'Autre demande',
]

// Tracé du fil : deux boucles verticales qui longent la page de part et d'autre
// du contenu, comme sur la maquette.
const THREAD_PATH =
  'M 1240 -20 C 1280 120, 1300 200, 1265 300 C 1220 420, 1290 520, 1330 600 ' +
  'C 1370 690, 1340 760, 1290 820 ' +
  'M -40 900 C 40 880, 110 900, 120 950 C 130 1010, 60 1060, -20 1080 ' +
  'C -90 1100, -60 1160, 20 1180 C 110 1200, 120 1260, 40 1300'

export default function Contact() {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')

  const scope = useRef(null)
  const threadRef = useRef(null)

  // Textes et coordonnées pilotés par le back-office (page Contact).
  const info = useSanityContent(CONTACT_QUERY, CONTACT_FALLBACK)

  // Le fil s'écrit seul à l'arrivée sur la page : pas de scroll nécessaire,
  // la page étant plus courte qu'un aller-retour de lecture.
  useGSAP(
    () => {
      const path = threadRef.current
      if (!path) return undefined

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const len = path.getTotalLength()
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len })

        const tl = gsap.timeline({ delay: 0.3 })

        tl.to(path, { strokeDashoffset: 0, duration: 2.6, ease: 'power1.inOut' })
          .from(
            '[data-contact-reveal]',
            { autoAlpha: 0, y: 24, duration: 0.8, ease: 'expo.out', stagger: 0.08 },
            0.15,
          )

        return () => tl.kill()
      })

      return () => mm.revert()
    },
    { scope },
  )

  function update(key) {
    return (event) => {
      const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
      setForm((current) => ({ ...current, [key]: value }))
      if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }))
    }
  }

  function validate() {
    const next = {}
    if (!form.firstName.trim()) next.firstName = 'Merci d’indiquer votre prénom.'
    if (!form.lastName.trim()) next.lastName = 'Merci d’indiquer votre nom.'
    if (!validateEmail(form.email.trim())) next.email = 'Adresse e-mail invalide.'
    if (!form.subject) next.subject = 'Merci de choisir un objet.'
    if (!form.message.trim()) next.message = 'Merci d’écrire votre message.'
    if (!form.consent) {
      next.consent = 'Merci de confirmer votre souhait d’échanger par mail.'
    }
    return next
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length > 0) return

    // Piège à robots : si rempli, on ignore silencieusement.
    if (form.honeypot) {
      setStatus('success')
      return
    }

    setStatus('sending')
    try {
      await sendContactMessage(form, info.formEndpoint)
      setStatus('success')
      setForm(emptyForm)
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="contact cq" ref={scope}>
      <svg
        aria-hidden="true"
        className="contact-thread"
        viewBox="0 0 1440 1340"
        preserveAspectRatio="none"
      >
        <path ref={threadRef} d={THREAD_PATH} vectorEffect="non-scaling-stroke" />
      </svg>

      <div className="contact-inner">
        <h1 className="contact-title" data-contact-reveal>
          {info.title}
        </h1>

        <p className="contact-intro" data-contact-reveal>
          {info.intro}
        </p>

        <dl className="contact-infos" data-contact-reveal>
          <div>
            <dt>Email</dt>
            <dd>
              <a href={`mailto:${info.email}`}>{info.email}</a>
            </dd>
          </div>
          <div>
            <dt>Téléphone</dt>
            <dd>
              <a href={`tel:${(info.phone ?? '').replace(/\s/g, '')}`}>{info.phone}</a>
            </dd>
          </div>
          <div>
            <dt>Instagram</dt>
            <dd>{info.instagram}</dd>
          </div>
        </dl>

        {status === 'success' ? (
          <div
            className="mx-auto mt-14 flex w-full max-w-[615px] flex-col items-center gap-6"
            role="status"
          >
            <p className="text-center text-[16px] text-[#0a0a0a]">{info.formSuccessMessage}</p>
            <BoutonEnvoyer type="button" onClick={() => setStatus('idle')}>
              Envoyer un autre message
            </BoutonEnvoyer>
          </div>
        ) : (
          <Formulaire onSubmit={handleSubmit} className="mx-auto mt-14 w-full max-w-[615px]">
            {/* Piège à robots, invisible pour les humains */}
            <div aria-hidden="true" className="sr-only">
              <input
                type="text"
                name="_gotcha"
                tabIndex={-1}
                autoComplete="off"
                value={form.honeypot}
                onChange={update('honeypot')}
              />
            </div>

            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <ChampTexte
                  label="Nom"
                  id="contact-nom"
                  name="lastName"
                  autoComplete="family-name"
                  placeholder="Votre nom"
                  value={form.lastName}
                  onChange={update('lastName')}
                  erreur={errors.lastName}
                />
                <ChampTexte
                  label="Prénom"
                  id="contact-prenom"
                  name="firstName"
                  autoComplete="given-name"
                  placeholder="Votre prénom"
                  value={form.firstName}
                  onChange={update('firstName')}
                  erreur={errors.firstName}
                />
              </div>

              <ChampTexte
                label="Email"
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="vous@exemple.fr"
                value={form.email}
                onChange={update('email')}
                erreur={errors.email}
              />

              <ChampSelect
                label="Objet de contact"
                id="contact-objet"
                name="subject"
                options={OBJETS}
                placeholder="Sélectionnez l’objet de votre message"
                valeur={form.subject}
                onChange={update('subject')}
                erreur={errors.subject}
              />

              <ChampLong
                label="Message"
                id="contact-message"
                name="message"
                rows={6}
                placeholder="Écrivez votre message…"
                value={form.message}
                onChange={update('message')}
                erreur={errors.message}
              />

              <CaseCocher
                label="Je confirme vouloir échanger par mail pour organiser mon activité de médiation"
                id="contact-consent"
                name="consent"
                checked={form.consent}
                onChange={update('consent')}
                erreur={errors.consent}
              />

              <div className="flex flex-col items-center gap-4 pt-2">
                <BoutonEnvoyer disabled={status === 'sending'} aria-busy={status === 'sending'}>
                  {status === 'sending' ? 'Envoi en cours…' : 'Envoyer'}
                </BoutonEnvoyer>

                {status === 'error' && (
                  <p role="alert" className="text-center text-[14px] text-[#b42318]">
                    L’envoi a échoué. Merci de réessayer ou de nous écrire par e-mail.
                  </p>
                )}

                {!isContactFormConfigured && (
                  <p className="text-center text-[14px] text-black/60">
                    Le formulaire n’est pas encore relié à un service d’envoi :
                    renseignez VITE_CONTACT_FORM_ENDPOINT.
                  </p>
                )}
              </div>
            </div>
          </Formulaire>
        )}
      </div>
    </section>
  )
}
