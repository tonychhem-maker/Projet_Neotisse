import PageHeader from '../components/ui/PageHeader'
import Placeholder from '../components/ui/Placeholder'

export default function Contact() {
  return (
    <>
      <PageHeader eyebrow="Échangeons" title="Contactez-nous">
        Vous organisez un événement et souhaitez accueillir un atelier ? Écrivez-nous.
      </PageHeader>
      <Placeholder label="Formulaire de contact" />
    </>
  )
}
