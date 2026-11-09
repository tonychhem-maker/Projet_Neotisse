import Button from '../components/ui/Button'

export default function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:px-8">
      <p className="text-sm font-bold uppercase tracking-widest text-leaf">Erreur 404</p>
      <h1 className="mt-4 text-5xl text-pine md:text-h1">Page introuvable</h1>
      <p className="mt-6 text-body">
        La page que vous cherchez n’existe pas ou a été déplacée.
      </p>
      <div className="mt-10">
        <Button to="/">Retour à l’accueil</Button>
      </div>
    </section>
  )
}
