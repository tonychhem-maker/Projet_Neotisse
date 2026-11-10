import PageHeader from '../components/ui/PageHeader'
import Placeholder from '../components/ui/Placeholder'

export default function APropos() {
  return (
    <>
      <PageHeader eyebrow="L'association" title="À propos de Neotisse">
        L’histoire, la démarche et les valeurs de l’association.
      </PageHeader>
      <Placeholder label="À propos" />

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl text-pine md:text-h2">L’équipe</h2>
        <p className="mt-4 max-w-2xl text-body">
          Les médiatrices et médiateurs qui font vivre les ateliers.
        </p>
        <Placeholder label="Équipe" />
      </section>
    </>
  )
}
