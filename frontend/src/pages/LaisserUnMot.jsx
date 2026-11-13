import { useState } from 'react'
import Button from '../components/ui/Button'
import Field from '../components/ui/Field'
import Honeypot from '../components/ui/Honeypot'
import PageHeader from '../components/ui/PageHeader'
import { isContactFormConfigured, sendTestimonial } from '../lib/forms'

const emptyForm = { author: '', organisation: '', message: '', rating: '', honeypot: '' }

export default function LaisserUnMot() {
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
    if (!form.author.trim()) next.author = 'Merci d’indiquer votre nom ou prénom.'
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
      await sendTestimonial(form)
      setStatus('success')
      setForm(emptyForm)
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="cq">
      <PageHeader eyebrow="Livre d'or" title="Laisser un mot">
        Partagez votre expérience après un atelier Neotisse.
      </PageHeader>

      <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        {status === 'success' ? (
          <div role="status" className="border border-leaf bg-leaf/10 p-8 text-center">
            <h2 className="text-[20px] md:text-[calc(24*var(--u))] text-pine">Merci pour votre message !</h2>
            <p className="mt-3 text-[15px] md:text-[calc(20*var(--u))]">
              Votre message sera relu par l’équipe avant d’être publié dans le livre d’or.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button to="/livre-d-or">Voir le livre d’or</Button>
              <Button variant="outline" onClick={() => setStatus('idle')}>
                Écrire un autre mot
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="relative space-y-6">
            <Honeypot
              value={form.honeypot}
              onChange={(value) => setForm((current) => ({ ...current, honeypot: value }))}
            />

            <div className="grid gap-6 sm:grid-cols-2">
              <Field
                label="Nom ou prénom"
                name="author"
                autoComplete="name"
                required
                value={form.author}
                onChange={update('author')}
                error={errors.author}
              />
              <Field
                label="Note"
                name="rating"
                as="select"
                value={form.rating}
                onChange={update('rating')}
              >
                <option value="">Sans note</option>
                <option value="5">5 étoiles — excellent</option>
                <option value="4">4 étoiles</option>
                <option value="3">3 étoiles — satisfaisant</option>
                <option value="2">2 étoiles</option>
                <option value="1">1 étoile</option>
              </Field>
            </div>

            <Field
              label="Structure / fonction (facultatif)"
              name="organisation"
              value={form.organisation}
              onChange={update('organisation')}
              hint="Ex : Musée de préhistoire de Solutré"
            />

            <Field
              label="Votre message"
              name="message"
              as="textarea"
              rows={6}
              required
              value={form.message}
              onChange={update('message')}
              error={errors.message}
              hint="Deux ou trois phrases suffisent."
            />

            {!isContactFormConfigured && !import.meta.env.VITE_TESTIMONIAL_API_ENDPOINT && (
              <p className="border border-sand bg-sand/40 px-4 py-3 text-sm">
                Le formulaire n’est pas encore relié à un service d’envoi. Renseignez
                <code className="mx-1 bg-white px-1">VITE_TESTIMONIAL_API_ENDPOINT</code>
                (création dans Sanity) ou
                <code className="mx-1 bg-white px-1">VITE_CONTACT_FORM_ENDPOINT</code>.
              </p>
            )}

            {status === 'error' && (
              <p role="alert" className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
                L’envoi a échoué. Merci de réessayer plus tard.
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4">
              <Button type="submit" disabled={status === 'sending'} aria-busy={status === 'sending'}>
                {status === 'sending' ? 'Envoi en cours…' : 'Envoyer mon message'}
              </Button>
              <Button to="/livre-d-or" variant="ghost">
                Retour au livre d’or
              </Button>
            </div>
          </form>
        )}
      </section>
    </div>
  )
}
