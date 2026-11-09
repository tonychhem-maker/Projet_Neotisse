import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import RichText from '../components/ui/RichText'
import SectionTitle from '../components/ui/SectionTitle'
import { useSanityDocument } from '../lib/useSanityDocument'

const HOME_QUERY = `*[_id == "homePage"][0]{
  heroTitle, heroText, "heroImage": heroImage.asset->url,
  introTitle, introText,
  workshopsTitle, "workshops": featuredWorkshops[]->{_id, title, slug, summary},
  availabilityTitle, availabilityText
}`

// Contenu de prévisualisation — sera remplacé par Sanity dès connexion du CMS.
const fallback = {
  heroTitle: 'Le tissage, du néolithique au Moyen Âge',
  heroText:
    "Neotisse conçoit et anime des ateliers de médiation textile qui font revivre gestes, outils et matières du passé.",
  introTitle: "L'association",
  introText:
    'Neotisse est une association de médiation culturelle spécialisée dans le textile archéologique.',
  workshopsTitle: 'Nos ateliers',
  workshops: [
    { _id: 'w1', title: 'Initiation au tissage néolithique', summary: 'Découverte des poids de métier et du tissage aux doigts.', slug: { current: 'atelier-neolithique' } },
    { _id: 'w2', title: 'Filature et teinture médiévales', summary: 'Du rouet aux colorants naturels.', slug: { current: 'filature-teinture' } },
    { _id: 'w3', title: 'Atelier en mouvement', summary: 'Intervention dans votre structure, tout public.', slug: { current: 'atelier-mouvement' } },
  ],
  availabilityTitle: 'Disponibilités',
  availabilityText: 'Nous intervenons toute l’année en France métropolitaine. Contactez-nous pour connaître nos prochaines dates.',
}

export default function Home() {
  const { data } = useSanityDocument(HOME_QUERY, fallback)
  const content = data ?? fallback

  return (
    <>
      <section className="bg-cream">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-widest text-leaf">
              Association de médiation textile
            </p>
            <h1 className="text-5xl leading-tight text-pine md:text-h1">
              {content.heroTitle}
            </h1>
            <p className="mt-6 max-w-lg text-body">{content.heroText}</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button to="/ateliers-de-mediation-textile">Découvrir nos ateliers</Button>
              <Button to="/contact" variant="outline">
                Nous contacter
              </Button>
            </div>
          </div>

          <div className="aspect-[4/5] w-full overflow-hidden rounded-3xl bg-sand">
            {content.heroImage ? (
              <img
                src={content.heroImage}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center p-8 text-center text-pine/60">
                Photographie à venir
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="border-y border-sand bg-sand/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionTitle eyebrow="Qui sommes-nous">{content.introTitle}</SectionTitle>
          <RichText value={content.introText} className="mt-6 max-w-3xl" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Médiation">{content.workshopsTitle}</SectionTitle>
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {content.workshops?.map((workshop) => (
            <li
              key={workshop._id}
              className="flex flex-col rounded-2xl border border-sand bg-white/40 p-6"
            >
              <h3 className="text-2xl text-pine">{workshop.title}</h3>
              <p className="mt-3 flex-1 text-base text-pine/80">{workshop.summary}</p>
              <Link
                to="/ateliers-de-mediation-textile"
                className="mt-6 text-sm font-bold text-leaf hover:underline"
              >
                En savoir plus →
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-pine px-6 py-12 text-cream sm:px-12">
          <h2 className="text-3xl md:text-h2">{content.availabilityTitle}</h2>
          <p className="mt-4 max-w-2xl text-body text-cream/90">{content.availabilityText}</p>
          <div className="mt-8">
            <Button to="/deplacements" variant="secondary">
              Voir nos déplacements
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
