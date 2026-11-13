import { useEffect, useMemo, useImperativeHandle, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { formatDateComplete } from '../../lib/dates'
import './CarteFrance.css'

/**
 * Géocode un code postal (ou, à défaut, un nom de ville) via l'API
 * geo.api.gouv.fr (service public, gratuit, sans clé) et renvoie
 * [latitude, longitude] du centre de la commune. Les résultats sont mis en
 * cache pour la session : un même code postal n'est jamais demandé deux fois.
 */
const cacheGeocodage = new Map()

async function geocoder(key, codePostal, ville) {
  if (cacheGeocodage.has(key)) return cacheGeocodage.get(key)
  let coords = null
  try {
    const requete = codePostal
      ? `https://geo.api.gouv.fr/communes?codePostal=${encodeURIComponent(codePostal)}&fields=nom,centre&format=json`
      : `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(ville || '')}&fields=nom,centre&format=json`
    const reponse = await fetch(requete)
    if (reponse.ok) {
      const communes = await reponse.json()
      const centre = communes?.[0]?.centre?.coordinates
      if (centre) coords = [centre[1], centre[0]] // [lon, lat] → [lat, lon]
    }
  } catch {
    // Pas de réseau ou service indisponible : pas de point pour ce code.
  }
  cacheGeocodage.set(key, coords)
  return coords
}

/**
 * Déduplique les entrées identiques d'un même point (le repli local répète
 * la ligne de démonstration de la maquette) pour ne pas empiler des blocs
 * identiques dans la bulle.
 */
function deduireBulle(groupe) {
  const vues = new Set()
  return groupe.filter((item) => {
    const cle = [item.date, item.city, item.note].map((v) => v || '').join('|')
    if (vues.has(cle)) return false
    vues.add(cle)
    return true
  })
}

// Contenu HTML de la bulle Leaflet : date, lieu et petit texte (Sanity),
// un bloc par déplacement du groupe.
function bulleHtml(groupe) {
  const lignes = deduireBulle(groupe)
    .map((item) => {
      const date = formatDateComplete(item.date)
      return `<span class="carte-leaflet__evenement">
        ${date ? `<span class="carte-leaflet__date">${date}</span>` : ''}
        ${item.city ? `<span class="carte-leaflet__lieu">${item.city}</span>` : ''}
        ${item.note ? `<span class="carte-leaflet__texte">${item.note}</span>` : ''}
      </span>`
    })
    .join('')
  return `<span class="carte-leaflet__bulle-interieur">${lignes}</span>`
}

/**
 * Carte de France interactive de la page Déplacements (Leaflet + tuiles
 * OpenStreetMap/CARTO, gratuites et sans clé API).
 *
 * Chaque déplacement renseigné dans Sanity porte un code postal : son
 * emplacement est géocodé via geo.api.gouv.fr et un point vert est posé sur
 * la commune. Le passage sur le point (ou son focus, ou un clic — utile sur
 * tactile) ouvre une petite bulle avec la date, le lieu et le petit texte
 * saisi dans Sanity. Survoler la ligne correspondante dans la liste allume
 * aussi le point (`itemActifId`).
 *
 * Plusieurs déplacements au même code postal partagent le même point et la
 * même bulle (entrées identiques dédupliquées).
 */
export default function CarteFrance({ items = [], itemActifId = null, className = '', ref }) {
  const conteneur = useRef(null)
  const carte = useRef(null)
  const marqueurs = useRef(new Map()) // clé code postal → marqueur Leaflet
  const [positions, setPositions] = useState({}) // clé → [lat, lon]

  // API impérative : la liste peut demander à centrer la carte sur un
  // événement (clé = code postal, ou ville si pas de code).
  useImperativeHandle(ref, () => ({
    centrer(cle) {
      const marqueur = marqueurs.current.get(cle)
      if (!marqueur || !carte.current) return
      const reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduit) {
        carte.current.setView(marqueur.getLatLng(), 9)
      } else {
        carte.current.flyTo(marqueur.getLatLng(), 9, { duration: 0.8 })
      }
      marqueur.openTooltip()
    },
  }))

  // Un point par code postal (plusieurs déplacements au même endroit
  // partagent le même point et la même bulle).
  const groupes = useMemo(() => {
    const parCode = new Map()
    items.forEach((item) => {
      const cle = item.codePostal || item.city
      if (!cle) return
      if (!parCode.has(cle)) parCode.set(cle, [])
      parCode.get(cle).push(item)
    })
    return [...parCode.entries()].map(([cle, groupe]) => ({
      cle,
      codePostal: groupe[0].codePostal,
      city: groupe[0].city,
      items: groupe,
    }))
  }, [items])

  // Initialisation de la carte (une seule fois).
  useEffect(() => {
    if (!conteneur.current || carte.current) return undefined
    const map = L.map(conteneur.current, {
      scrollWheelZoom: false, // ne capte pas la molette au détriment du scroll de page
      zoomControl: false,
      attributionControl: true,
    })
    map.attributionControl.setPrefix(false)
    // Tuiles officielles OpenStreetMap : gratuites, sans clé API (les tuiles
    // CARTO affichent désormais un filigrane « API KEY REQUIRED », et
    // tile.openstreetmap.fr bloque les chargements tiers).
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)
    // France métropolitaine entière, Corse comprise.
    map.fitBounds(
      [
        [41.3, -5.3],
        [51.2, 9.7],
      ],
      { padding: [8, 8] },
    )
    setTimeout(() => map.invalidateSize(), 60)
    carte.current = map
    return undefined
  }, [])

  // Géocodage des codes postaux (une requête par code, résultat en cache).
  useEffect(() => {
    let annule = false
    Promise.all(
      groupes.map(async (groupe) => {
        const coords = await geocoder(groupe.cle, groupe.codePostal, groupe.city)
        return [groupe.cle, coords]
      }),
    ).then((resultats) => {
      if (annule) return
      setPositions((courant) => {
        const suivant = { ...courant }
        let change = false
        resultats.forEach(([cle, coords]) => {
          if (coords && !suivant[cle]) {
            suivant[cle] = coords
            change = true
          }
        })
        return change ? suivant : courant
      })
    })
    return () => {
      annule = true
    }
  }, [groupes])

  // Pose / met à jour les points quand les positions sont connues.
  useEffect(() => {
    const map = carte.current
    if (!map) return
    groupes.forEach((groupe) => {
      const coords = positions[groupe.cle]
      const existant = marqueurs.current.get(groupe.cle)
      if (!coords) {
        return
      }
      const icone = L.divIcon({
        className: 'carte-leaflet__icone',
        html: '<span class="carte-leaflet__point"></span>',
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      })
      if (existant) return // déjà posé (les coordonnées géocodées ne bougent pas)
      const marqueur = L.marker(coords, { icon: icone, keyboard: true, riseOnHover: true })
      marqueur.bindTooltip(bulleHtml(groupe.items), {
        direction: 'top',
        offset: [0, -12],
        className: 'carte-leaflet__bulle',
        opacity: 1,
      })
      // Survol/focus : la bulle s'ouvre ; clic : elle bascule (tactile).
      marqueur.on('click', () => {
        if (marqueur.isTooltipOpen()) {
          marqueur.closeTooltip()
        } else {
          marqueur.openTooltip()
        }
      })
      marqueur.addTo(map)
      marqueurs.current.set(groupe.cle, marqueur)
    })
  }, [positions, groupes])

  // Ligne survolée dans la liste (`itemActifId`) : allume le point et ouvre
  // sa bulle ; à la sortie, tout retombe.
  useEffect(() => {
    const allume = itemActifId
      ? groupes.find((groupe) => groupe.items.some((item) => item._id === itemActifId))
      : null
    marqueurs.current.forEach((marqueur, cle) => {
      const element = marqueur.getElement()
      if (!element) return
      const actif = allume?.cle === cle
      element.classList.toggle('est-lit', actif)
      if (actif && !marqueur.isTooltipOpen()) marqueur.openTooltip()
      if (!actif && marqueur.isTooltipOpen()) marqueur.closeTooltip()
    })
  }, [itemActifId, groupes, positions])

  // Nettoyage (démontage).
  useEffect(
    () => () => {
      if (carte.current) {
        carte.current.remove()
        carte.current = null
        marqueurs.current = new Map()
      }
    },
    [],
  )

  return (
    <figure className={`carte-france ${className}`.trim()} role="group" aria-label="Carte de France des déplacements">
      <div ref={conteneur} className="carte-leaflet" />
    </figure>
  )
}
