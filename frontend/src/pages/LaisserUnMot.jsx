import Button from '../components/ui/Button'
import PageHeader from '../components/ui/PageHeader'
import Placeholder from '../components/ui/Placeholder'

export default function LaisserUnMot() {
  return (
    <>
      <PageHeader eyebrow="Livre d'or" title="Laisser un mot">
        Partagez votre expérience après un atelier Neotisse.
      </PageHeader>
      <Placeholder label="Formulaire — Laisser un mot" />
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <Button to="/livre-d-or" variant="outline">
          Retour au livre d’or
        </Button>
      </div>
    </>
  )
}
