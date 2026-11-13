import { createClient } from '@sanity/client'

/**
 * Création d'un témoignage du livre d'or (fonction serverless — Vercel /
 * Netlify Functions). Le site public poste ici en JSON ; la fonction écrit
 * le document `testimonial` dans Sanity avec `status: pending`, pour la
 * file « à modérer » du studio.
 *
 * Pourquoi une fonction : le token d'écriture Sanity ne doit JAMAIS être
 * exposé dans le navigateur (variables VITE_*). Il vit uniquement côté
 * serveur, en variable d'environnement.
 *
 * Variables d'environnement côté hébergeur (pas de préfixe VITE_) :
 * - SANITY_WRITE_TOKEN  : token avec droits « write » (manage.sanity.io →
 *   API → Tokens). Obligatoire.
 * - SANITY_PROJECT_ID   : défaut k7jmb6gr.
 * - SANITY_DATASET      : défaut production.
 *
 * Le front vise cette fonction via `VITE_TESTIMONIAL_API_ENDPOINT`
 * (ex : https://neotisse.fr/api/submit-testimonial). Sans cette variable,
 * le formulaire retombe sur Formspree (modération par e-mail).
 */

const PROJECT_ID = process.env.SANITY_PROJECT_ID ?? 'k7jmb6gr'
const DATASET = process.env.SANITY_DATASET ?? 'production'

// Les mêmes limites que le schéma `testimonial` (sanity/schemas/documents).
const LIMITES = { author: 60, organisation: 120, message: 1000 }

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2026-01-01',
  useCdn: false,
})

// CORS : le front du site est autorisé à poster (origines de dev et prod).
const ORIGINES_AUTORISEES = [
  'http://localhost:5173',
  'http://localhost:4173',
  'https://neotisse.fr',
  'https://www.neotisse.fr',
]

function entetesCors(origine) {
  return {
    'Access-Control-Allow-Origin': ORIGINES_AUTORISEES.includes(origine) ? origine : '',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

function reponse(res, statut, corps) {
  res.statusCode = statut
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(corps))
}

export default async function handler(req, res) {
  const cors = entetesCors(req.headers.origin ?? '')

  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    Object.entries(cors).forEach(([cle, valeur]) => res.setHeader(cle, valeur))
    res.end()
    return
  }

  Object.entries(cors).forEach(([cle, valeur]) => res.setHeader(cle, valeur))

  if (req.method !== 'POST') {
    reponse(res, 405, { error: 'Méthode non autorisée' })
    return
  }

  if (!process.env.SANITY_WRITE_TOKEN) {
    reponse(res, 500, { error: 'SANITY_WRITE_TOKEN non configuré côté serveur' })
    return
  }

  let donnees
  try {
    donnees = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
  } catch {
    reponse(res, 400, { error: 'Corps JSON invalide' })
    return
  }

  // Assainissement : les champs sont tronqués aux limites du schéma, le
  // honeypot (champ caché rempli par un robot) fait croire au succès.
  const author = String(donnees.author ?? '').trim().slice(0, LIMITES.author)
  const organisation = String(donnees.organisation ?? '').trim().slice(0, LIMITES.organisation)
  const message = String(donnees.message ?? '').trim().slice(0, LIMITES.message)
  const rating = Number(donnees.rating) >= 1 && Number(donnees.rating) <= 5 ? Number(donnees.rating) : null

  if (donnees.honeypot) {
    reponse(res, 200, { ok: true })
    return
  }

  if (!author || message.length < 10) {
    reponse(res, 422, { error: 'Nom ou message manquant' })
    return
  }

  try {
    await client.create({
      _type: 'testimonial',
      author,
      organisation: organisation || undefined,
      message,
      rating,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    })
    reponse(res, 200, { ok: true })
  } catch (error) {
    reponse(res, 502, { error: 'Écriture Sanity impossible', detail: error.message })
  }
}
