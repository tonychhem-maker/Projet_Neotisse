import { aboutPage } from './documents/aboutPage'
import { actualitesPage } from './documents/actualitesPage'
import { ateliersPage } from './documents/ateliersPage'
import { availability } from './documents/availability'
import { contactInfo } from './documents/contactInfo'
import { deplacement } from './documents/deplacement'
import { deplacementsPage } from './documents/deplacementsPage'
import { homePage } from './documents/homePage'
import { legalPage } from './documents/legalPage'
import { livreDorPage } from './documents/livreDorPage'
import { partner } from './documents/partner'
import { post } from './documents/post'
import { siteSettings } from './documents/siteSettings'
import { teamMember } from './documents/teamMember'
import { testimonial } from './documents/testimonial'
import { workshop } from './documents/workshop'
import { workshopFormat } from './documents/workshopFormat'
import { link } from './objects/link'
import { openGraph } from './objects/openGraph'
import { richText } from './objects/richText'
import { seo } from './objects/seo'

export const schemaTypes = [
  // Collection
  workshop,
  workshopFormat,
  post,
  partner,
  teamMember,
  testimonial,
  availability,
  deplacement,

  // Singletons (un seul document de chaque type)
  siteSettings,
  homePage,
  ateliersPage,
  aboutPage,
  contactInfo,
  deplacementsPage,
  livreDorPage,
  actualitesPage,
  legalPage,

  // Objets réutilisables
  seo,
  openGraph,
  richText,
  link,
]
