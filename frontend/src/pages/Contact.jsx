import { useState } from 'react'
import Field from '../components/ui/Field'
import Honeypot from '../components/ui/Honeypot'
import PageHeader from '../components/ui/PageHeader'
import Button from '../components/ui/Button'
import { isContactFormConfigured, sendContactMessage, validateEmail } from '../lib/forms'

const emptyForm = { name: '', email: '', organisation: '', message: '', honeypot: '' }

export default function Contact() {
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
    if (!form.name.trim()) next.name = 'Merci d’indiquer votre nom.'
    if (!validateEmail(form.email.trim())) next.email = 'Adresse e-mail invalide.'
    if (form.message.trim().length < 20) {
      next.message = 'Merci de détailler votre demande (20 caractères minimum).'
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
      await sendContactMessage(form)
      setStatus('success')
      setForm(emptyForm)
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <PageHeader eyebrow="Échangeons" title="Contactez-nous">
        Vous organisez un événement et souhaitez accueillir un atelier ? Écrivez-nous.
      </PageHeader>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        {status === 'success' ? (
          <div
            role="status"
            className="rounded-2xl border border-leaf bg-leaf/10 p-8 text-center"
          >
            <h2 className="text-2xl text-pine">Merci !</h2>
            <p className="mt-3 text-body">
              Votre message a bien été envoyé, nous vous répondrons rapidement.
            </p>
            <div className="mt-6">
              <Button variant="outline" onClick={() => setStatus('idle')}>
                Envoyer un autre message
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
                label="Nom"
                name="name"
                autoComplete="name"
                required
                value={form.name}
                onChange={update('name')}
                error={errors.name}
              />
              <Field
                label="E-mail"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={update('email')}
                error={errors.email}
              />
            </div>

            <Field
              label="Structure / organisation"
              name="organisation"
              value={form.organisation}
              onChange={update('organisation')}
              hint="Musée, université, coopérative, collectivité…"
            />

            <Field
              label="Message"
              name="message"
              as="textarea"
              rows={7}
              required
              value={form.message}
              onChange={update('message')}
              error={errors.message}
              hint="Précisez le contexte, la date envisagée et le public visé."
            />

            {!isContactFormConfigured && (
              <p className="rounded-lg border border-sand bg-sand/40 px-4 py-3 text-sm">
                Le formulaire n’est pas encore relié à un service d’envoi. Renseignez
                <code className="mx-1 rounded bg-white px-1">VITE_CONTACT_FORM_ENDPOINT</code>
                (Formspree ou équivalent).
              </p>
            )}

            {status === 'error' && (
              <p role="alert" className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
                L’envoi a échoué. Merci de réessayer ou de nous écrire par e-mail.
              </p>
            )}

            <div className="flex items-center gap-4">
              <Button type="submit" disabled={status === 'sending'} aria-busy={status === 'sending'}>
                {status === 'sending' ? 'Envoi en cours…' : 'Envoyer le message'}
              </Button>
              <p className="text-sm text-pine/60">Les champs marqués d’un * sont obligatoires.</p>
            </div>
          </form>
        )}
      </section>
    </>
  )
}
