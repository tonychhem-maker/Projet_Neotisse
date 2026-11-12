import { useMemo } from 'react'
import AboutBlock from '../components/sections/AboutBlock'
import ClosingCta from '../components/sections/ClosingCta'
import Hero from '../components/sections/Hero'
import Partners from '../components/sections/Partners'
import WorkshopFormats from '../components/sections/WorkshopFormats'
import {
  ABOUT_FALLBACK,
  CTA_FALLBACK,
  FORMATS_FALLBACK,
  HERO_TITLE,
  PARTNERS_FALLBACK,
} from '../data/home'
import { HOME_QUERY, useSanityContent } from '../lib/queries'

// Découpe le titre du back-office en lignes, la hero révélant chaque ligne
// depuis son masque.
const FALLBACK_LINES = ['Ateliers de', 'Médiations', 'Tissage pour', 'Tous']

function splitTitle(title) {
  const words = title.trim().split(/\s+/)
  if (words.length <= 2) return words

  const lines = []
  const perLine = Math.ceil(words.length / 4)
  for (let i = 0; i < words.length; i += perLine) {
    lines.push(words.slice(i, i + perLine).join(' '))
  }
  return lines
}

export default function Home() {
  const content = useSanityContent(HOME_QUERY, {})

  const heroLines = useMemo(() => {
    if (!content.heroTitle) return FALLBACK_LINES
    return splitTitle(content.heroTitle)
  }, [content.heroTitle])

  // Paragraphes : le Portable Text Sanity est aplati en textes simples.
  const paragraphs = useMemo(() => {
    const blocks = content.introText
    if (!Array.isArray(blocks) || blocks.length === 0) return ABOUT_FALLBACK.paragraphs

    const texts = blocks
      .filter((block) => block._type === 'block')
      .map((block) => block.children?.map((child) => child.text).join('') ?? '')
      .filter(Boolean)

    return texts.length > 0 ? texts : ABOUT_FALLBACK.paragraphs
  }, [content.introText])

  const formats = useMemo(() => {
    if (!Array.isArray(content.formats) || content.formats.length === 0) {
      return FORMATS_FALLBACK
    }

    return content.formats.map((format, index) => ({
      id: format.number || String(index + 1).padStart(2, '0'),
      title: (format.title ?? '').toUpperCase(),
      text: format.description ?? '',
      image: format.image?.src ?? FORMATS_FALLBACK[index % FORMATS_FALLBACK.length].image,
      link: format.linkHref ?? undefined,
    }))
  }, [content.formats])

  const partners = useMemo(() => {
    const list = Array.isArray(content.partners) ? content.partners : []
    const logos = list
      .map((partner) => ({
        name: partner.name ?? 'Partenaire',
        src: partner.logo?.src,
        w: 180,
      }))
      .filter((logo) => logo.src)

    if (logos.length === 0) return PARTNERS_FALLBACK

    const half = Math.ceil(logos.length / 2)
    return {
      title: PARTNERS_FALLBACK.title,
      row1: logos.slice(0, half),
      row2: logos.slice(half),
    }
  }, [content.partners])

  return (
    <div className="cq">
      <Hero title={content.heroTitle ?? HERO_TITLE} lines={heroLines} />

      <AboutBlock
        title={content.introTitle || ABOUT_FALLBACK.title}
        paragraphs={paragraphs}
        imageSrc={content.heroImage?.src ?? ABOUT_FALLBACK.imageSrc}
        imageAlt={content.heroImage?.alt || ABOUT_FALLBACK.imageAlt}
      />

      <WorkshopFormats formats={formats} />

      <Partners {...partners} />

      <ClosingCta {...CTA_FALLBACK} />
    </div>
  )
}
