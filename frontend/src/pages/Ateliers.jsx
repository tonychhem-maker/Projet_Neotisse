import { useMemo } from 'react'
import AteliersCta from '../components/sections/AteliersCta'
import AteliersFormats from '../components/sections/AteliersFormats'
import AteliersHero from '../components/sections/AteliersHero'
import AteliersSecondary from '../components/sections/AteliersSecondary'
import {
  ATELIERS_FALLBACK,
  ATELIERS_FORMATS_FALLBACK,
  SECONDARY_SECTIONS_FALLBACK,
} from '../data/ateliers'
import { ATELIERS_QUERY, useSanityContent } from '../lib/queries'

// Le titre de la bannière est découpé en mots, pour l'assemblage animé :
// « ATELIERS » arrive de la gauche, « SUR-MESURE » de la droite.
function toWords(title) {
  return String(title).trim().split(/\s+/).filter(Boolean)
}

// Le texte de la bannière est saisi en un bloc dans Sanity : chaque ligne du
// champ devient un paragraphe, les lignes vides sont ignorées.
function toParagraphs(text) {
  if (Array.isArray(text)) return text.map((line) => String(line).trim()).filter(Boolean)
  if (typeof text !== 'string') return []
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
}

// Formate un document Sanity dans la forme attendue par `AteliersFormats`.
// Tant qu'un format n'a pas d'image dans le back-office, on reprend l'une des
// photos locales du site, pour ne jamais laisser la colonne vide.
const toFormat = (format, index) => ({
  id: format.id ?? String(index + 1),
  title: String(format.title ?? '').toUpperCase(),
  text: format.text ?? '',
  image:
    format.image?.src ??
    ATELIERS_FORMATS_FALLBACK[index % ATELIERS_FORMATS_FALLBACK.length]?.image,
})

/**
 * Page Ateliers : bannière, formats d'atelier, sections secondaires et bloc
 * final. Tout le contenu éditorial vient du document Sanity « Page Ateliers » ;
 * les formats sont repris des fiches « Format d'atelier ».
 *
 * `ATELIERS_QUERY` renvoie `{ page, featuredFormats, allFormats }`. La fusion
 * avec le repli porte sur la clé `page` (même forme), d'où le repli imbriqué.
 */
export default function Ateliers() {
  // Repli stable : `useSanityContent` s'en sert comme base à chaque rendu.
  const fallback = useMemo(() => ({ page: ATELIERS_FALLBACK }), [])
  const fetched = useSanityContent(ATELIERS_QUERY, fallback)
  const page = fetched.page ?? ATELIERS_FALLBACK

  const words = useMemo(() => toWords(page.heroTitle), [page.heroTitle])

  const paragraphs = useMemo(() => {
    const list = toParagraphs(page.heroText)
    return list.length > 0 ? list : toParagraphs(ATELIERS_FALLBACK.heroText)
  }, [page.heroText])

  const formats = useMemo(() => {
    // Formats choisis dans le back-office ; à défaut, tous les formats visibles.
    const featured = Array.isArray(fetched.featuredFormats) ? fetched.featuredFormats : []
    const list = featured.length > 0 ? featured : fetched.allFormats
    const usable = (Array.isArray(list) ? list : []).filter((format) => format?.title)

    return usable.length > 0 ? usable.map(toFormat) : ATELIERS_FORMATS_FALLBACK
  }, [fetched.featuredFormats, fetched.allFormats])

  const sections = useMemo(() => {
    const list = Array.isArray(page.secondarySections) ? page.secondarySections : []
    const usable = list.filter((section) => section?.title)
    return usable.length > 0 ? usable : SECONDARY_SECTIONS_FALLBACK
  }, [page.secondarySections])

  return (
    <div className="ateliers-page cq">
      <AteliersHero
        title={page.heroTitle}
        words={words}
        text={paragraphs}
        imageSrc={page.heroImage?.src ?? ATELIERS_FALLBACK.heroImage.src}
      />

      <AteliersFormats formats={formats} />

      <AteliersSecondary sections={sections} />

      <AteliersCta title={page.ctaTitle} link={page.ctaLink} />
    </div>
  )
}
