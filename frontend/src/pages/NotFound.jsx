import Button from '../components/ui/Button'

export default function NotFound() {
  return (
    <div className="cq">
      <section className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-widest text-leaf">Erreur 404</p>
        <h1 className="mt-4 text-5xl text-pine md:text-[calc(64*var(--u))]">Page introuvable</h1>
        <p className="mt-6 text-[15px] md:text-[calc(18*var(--u))]">
          La page que vous cherchez n’existe pas ou a été déplacée.
        </p>
        <div className="mt-10">
          <Button to="/">Retour à l’accueil</Button>
        </div>
      </section>
    </div>
  )
}
