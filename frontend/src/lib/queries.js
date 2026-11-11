// Requêtes GROQ du site.
//
// Chaque page dispose de son singleton côté Sanity. Les requêtes renvoient le
// document complet ; la page fusionne le résultat avec son contenu de repli
// (ce qui est renseigné dans Sanity fait foi, ce qui est vide garde le texte
// codé en dur).
import { useEffect, useState } from 'react'
import { isSanityConfigured, sanityClient } from './sanity'

const IMAGE_PROJECTION = `{
  "src": asset->url,
  "alt": coalesce(alt, asset->altText, ""),
  "hotspot": hotspot,
  "crop": crop
}`

export const HOME_QUERY = `{
  "heroTitle": *[_id == "homePage"][0].heroTitle,
  "introTitle": *[_id == "homePage"][0].introTitle,
  "introText": *[_id == "homePage"][0].introText,
  "heroImage": *[_id == "homePage"][0].heroImage ${IMAGE_PROJECTION},
  "formats": *[_type == "workshopFormat" && visible != false] | order(order asc, _createdAt asc) {
    "_id": _id,
    "title": title,
    "number": number,
    "description": description,
    "image": image ${IMAGE_PROJECTION},
    "linkHref": link.href,
    "linkLabel": link.label
  },
  "partners": *[_type == "partner"] | order(order asc, name asc) {
    "_id": _id,
    "name": name,
    "url": url,
    "logo": logo ${IMAGE_PROJECTION}
  }
}`

export const ATELIERS_QUERY = `{
  "page": *[_id == "ateliersPage"][0]{
    "heroTitle": heroTitle,
    "heroText": heroText,
    "heroImage": heroImage ${IMAGE_PROJECTION},
    "secondaryTitle": secondaryTitle,
    "secondarySections": secondarySections[]{
      "_key": _key,
      "title": title,
      "text": text
    },
    "ctaTitle": ctaTitle,
    "ctaLink": ctaLink{
      "label": label,
      "to": coalesce(internalPath, externalUrl)
    }
  },
  "featuredFormats": *[_id == "ateliersPage"][0].formats[]->{
    "id": _id,
    "title": title,
    "text": description,
    "image": image ${IMAGE_PROJECTION}
  },
  "allFormats": *[_type == "workshopFormat" && visible != false] | order(order asc, _createdAt asc) {
    "id": _id,
    "title": title,
    "text": description,
    "image": image ${IMAGE_PROJECTION}
  }
}`

export const ABOUT_QUERY = `{
  "page": *[_id == "aboutPage"][0]{
    "heroTitle": heroTitle,
    "heroText": heroText,
    "bannerImage": bannerImage ${IMAGE_PROJECTION},
    "bannerTitle": bannerTitle,
    "histoireTitle": histoireTitle,
    "histoireText": histoireText,
    "histoireImage": histoireImage ${IMAGE_PROJECTION},
    "members": members[]->{
      "id": _id,
      "name": name,
      "role": role,
      "bio": bio,
      "photo": photo ${IMAGE_PROJECTION}
    },
    "moreLink": moreLink{
      "label": label,
      "to": coalesce(internalPath, externalUrl)
    }
  }
}`

export const CONTACT_QUERY = `{
  "title": *[_id == "contactInfo"][0].title,
  "intro": *[_id == "contactInfo"][0].intro,
  "email": *[_id == "contactInfo"][0].email,
  "phone": *[_id == "contactInfo"][0].phone,
  "address": *[_id == "contactInfo"][0].address,
  "formEndpoint": *[_id == "contactInfo"][0].formEndpoint,
  "formSuccessMessage": *[_id == "contactInfo"][0].formSuccessMessage,
  "instagram": *[_id == "siteSettings"][0].socialLinks[label match "instagram*"][0].href
}`

export const LIVRE_DOR_QUERY = `{
  "page": *[_id == "livreDorPage"][0]{
    "heroTitle": heroTitle,
    "sectionTitle": sectionTitle,
    "seeAllLink": seeAllLink{
      "label": label,
      "to": coalesce(internalPath, externalUrl)
    },
    "featured": featured{
      "author": author,
      "organisation": organisation,
      "message": message,
      "avatar": avatar ${IMAGE_PROJECTION}
    }
  },
  "testimonials": *[_type == "testimonial" && status == "published" && defined(publishedAt)] | order(publishedAt desc)[0..2] {
    "id": _id,
    "author": author,
    "organisation": organisation,
    "message": message
  }
}`

export const SITE_SETTINGS_QUERY = `{
  "name": *[_id == "siteSettings"][0].name,
  "baseline": *[_id == "siteSettings"][0].baseline,
  "email": *[_id == "siteSettings"][0].email,
  "phone": *[_id == "siteSettings"][0].phone,
  "address": *[_id == "siteSettings"][0].address,
  "socialLinks": *[_id == "siteSettings"][0].socialLinks[]{ "label": label, "href": href }
}`

/**
 * Charge une requête GROQ et fusionne le résultat avec un contenu de repli.
 *
 * Règle de fusion : une valeur non vide venue de Sanity remplace le repli ;
 * un champ absent, vide ou une requête en échec laisse le repli intact. Le site
 * reste donc entièrement fonctionnel tant que le back-office n'est pas rempli.
 */
export function useSanityContent(query, fallback) {
  const [data, setData] = useState(fallback)

  useEffect(() => {
    if (!sanityClient) return undefined

    let cancelled = false

    sanityClient
      .fetch(query)
      .then((result) => {
        if (cancelled || !result) return
        setData((current) => mergeContent(current, result))
      })
      .catch(() => {
        // En cas d'erreur réseau, le repli reste affiché.
      })

    return () => {
      cancelled = true
    }
  }, [query])

  return data
}

function isEmpty(value) {
  if (value === null || value === undefined || value === '') return true
  if (Array.isArray(value)) return value.length === 0
  return false
}

function mergeContent(fallback, incoming) {
  const merged = { ...fallback }

  Object.entries(incoming).forEach(([key, value]) => {
    if (isEmpty(value)) return

    const current = fallback?.[key]
    const isPlainObject = (v) => v && typeof v === 'object' && !Array.isArray(v)

    if (isPlainObject(value) && isPlainObject(current)) {
      merged[key] = mergeContent(current, value)
      return
    }

    merged[key] = value
  })

  return merged
}

export { isSanityConfigured }
