import { useMemo } from 'react'
import AProposEquipe from '../components/sections/AProposEquipe'
import AProposHero from '../components/sections/AProposHero'
import AProposHistoire from '../components/sections/AProposHistoire'
import { APROPOS_FALLBACK } from '../data/aPropos'
import { ABOUT_QUERY, useSanityContent } from '../lib/queries'
import './APropos.css'

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

// Formate un document Sanity « Membre de l'équipe » dans la forme attendue par
// `AProposEquipe`. Tant qu'un membre n'a pas de photo dans le back-office, on
// reprend l'une des photos locales de la maquette, pour ne jamais laisser la
// fiche sans portrait.
const toMember = (member, index, fallbackMembers) => ({
  id: member.id ?? member.name ?? String(index + 1),
  name: member.name ?? '',
  role: member.role ?? '',
  bio: member.bio ?? '',
  photo:
    member.photo?.src ? member.photo : fallbackMembers[index % fallbackMembers.length]?.photo,
})

/**
 * Page À propos : bannière, grande image avec le mot de l'association,
 * histoire puis équipe. Tout le contenu éditorial vient du document Sanity
 * « Page À propos » ; les membres viennent des fiches « Membre de l'équipe ».
 *
 * `ABOUT_QUERY` renvoie `{ page }`. La fusion avec le repli porte sur la clé
 * `page` (même forme), d'où le repli imbriqué.
 */
export default function APropos() {
  // Repli stable : `useSanityContent` s'en sert comme base à chaque rendu.
  const fallback = useMemo(() => ({ page: APROPOS_FALLBACK }), [])
  const fetched = useSanityContent(ABOUT_QUERY, fallback)
  const page = fetched.page ?? APROPOS_FALLBACK

  const paragraphs = useMemo(() => {
    const list = toParagraphs(page.heroText)
    return list.length > 0 ? list : toParagraphs(APROPOS_FALLBACK.heroText)
  }, [page.heroText])

  const members = useMemo(() => {
    const list = Array.isArray(page.members) ? page.members : []
    const usable = list.filter((member) => member?.name)
    return usable.length > 0
      ? usable.map((member, index) => toMember(member, index, APROPOS_FALLBACK.members))
      : APROPOS_FALLBACK.members
  }, [page.members])

  return (
    <div className="a-propos-page cq">
      <AProposHero title={page.heroTitle} text={paragraphs} />

      <AProposHistoire
        image={page.bannerImage}
        bannerTitle={page.bannerTitle}
        title={page.histoireTitle}
        text={page.histoireText}
        histoireImage={page.histoireImage}
      />

      <AProposEquipe members={members} moreLink={page.moreLink} />
    </div>
  )
}
