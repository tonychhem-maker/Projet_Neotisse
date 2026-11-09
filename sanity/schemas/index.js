import { aboutPage } from './documents/aboutPage'
import { availability } from './documents/availability'
import { contactInfo } from './documents/contactInfo'
import { homePage } from './documents/homePage'
import { legalPage } from './documents/legalPage'
import { partner } from './documents/partner'
import { post } from './documents/post'
import { siteSettings } from './documents/siteSettings'
import { teamMember } from './documents/teamMember'
import { testimonial } from './documents/testimonial'
import { workshop } from './documents/workshop'
import { link } from './objects/link'
import { openGraph } from './objects/openGraph'
import { richText } from './objects/richText'
import { seo } from './objects/seo'

export const schemaTypes = [
  // Collection
  workshop,
  post,
  partner,
  teamMember,
  testimonial,
  availability,

  // Singletons (un seul document de chaque type)
  siteSettings,
  homePage,
  aboutPage,
  contactInfo,
  legalPage,

  // Objets réutilisables
  seo,
  openGraph,
  richText,
  link,
]
