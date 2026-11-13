import { useEffect, useMemo, useImperativeHandle, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import departements from '../../assets/deplacements/departements.json'
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

/** Code de département depuis un code postal (« 20 » couvre 2A et 2B). */
function departementsDuCodePostal(codePostal) {
  const deux = (codePostal || '').slice(0, 2)
  if (deux === '20') return ['2A', '2B']
  return deux ? [deux] : []
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
 * Ouvre la bulle puis re-mesure sa position au rendu suivant. Leaflet centre
 * la bulle au-dessus de son point grâce à la largeur mesurée au moment de
 * l'ouverture (`offsetWidth`) : si la mise en page n'est pas stabilisée à cet
 * instant, la mesure tombe à 0 — la bulle restait alors ancrée par son bord
 * gauche sur le point (au lieu d'être centrée) et dépassait de la carte,
 * sans jamais être recalculée. La re-mesure au frame suivant la replace.
 */
function ouvrirBulle(marqueur) {
  marqueur.openTooltip()
  remesurerBulle(marqueur)
}

/** Re-mesure et repositionne la bulle ouverte au frame suivant (voir
    `ouvrirBulle`) — sans recréation de contenu ni clignotement. */
function remesurerBulle(marqueur) {
  requestAnimationFrame(() => {
    if (marqueur.isTooltipOpen()) marqueur.getTooltip().update()
  })
}

/**
 * Carte de France interactive de la page Déplacements : Leaflet sans fond
 * de carte — le seul dessin est le contour des départements (GeoJSON
 * france-geojson, dérivé d'OpenStreetMap) sur fond crème, dans la charte du
 * site. Pas de tuiles ni de détails superflus.
 *
 * Chaque déplacement renseigné dans Sanity porte un code postal : son
 * emplacement est géocodé via geo.api.gouv.fr et un point vert y est posé.
 *
 * Interaction :
 * - survoler ou cliquer un département (ou la ligne correspondante de la
 *   liste) fait s'illuminer le point de l'événement qui s'y trouve ;
 * - survoler / focaliser / cliquer le point ouvre une petite bulle avec la
 *   date, le lieu et le petit texte saisi dans Sanity.
 *
 * Plusieurs déplacements au même code postal partagent le même point et la
 * même bulle (entrées identiques dédupliquées).
 */
export default function CarteFrance({ items = [], itemActifId = null, className = '', ref }) {
  const conteneur = useRef(null)
  const carte = useRef(null)
  const couche = useRef(null) // couche GeoJSON des départements
  const marqueurs = useRef(new Map()) // clé code postal → marqueur Leaflet
  const [positions, setPositions] = useState({}) // clé → [lat, lon]
  const [deptSurvole, setDeptSurvole] = useState(null) // département sous le curseur
  const [deptEpingle, setDeptEpingle] = useState(null) // département cliqué (tactile)

  // API impérative : la liste peut demander à centrer la carte sur un
  // événement (clé = code postal, ou ville si pas de code).
  useImperativeHandle(ref, () => ({
    centrer(cle) {
      const marqueur = marqueurs.current.get(cle)
      if (!marqueur || !carte.current) return
      const reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      // La bulle doit être repositionnée pour la VUE D'ARRIVÉE : ouverte
      // pendant l'animation, elle garderait la position de l'ancienne vue et
      // sortirait de la carte. On la referme et on la rouvre au terme du
      // mouvement (`moveend`), une fois le point à sa place définitive.
      marqueur.closeTooltip()
      carte.current.once('moveend', () => ouvrirBulle(marqueur))
      if (reduit) {
        carte.current.setView(marqueur.getLatLng(), 9)
      } else {
        carte.current.flyTo(marqueur.getLatLng(), 9, { duration: 0.8 })
      }
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
      departements: departementsDuCodePostal(groupe[0].codePostal),
      items: groupe,
    }))
  }, [items])

  // Département actif : survolé ou épinglé sur la carte, ou ligne survolée
  // dans la liste (`itemActifId`).
  const deptLigne = useMemo(() => {
    if (!itemActifId) return null
    const groupe = groupes.find((g) => g.items.some((item) => item._id === itemActifId))
    return groupe?.departements[0] || null
  }, [groupes, itemActifId])
  const deptActif = deptSurvole || deptEpingle || deptLigne

  // Initialisation de la carte (une seule fois) : fond crème + contour des
  // départements, cadré sur la France métropolitaine.
  useEffect(() => {
    if (!conteneur.current || carte.current) return undefined
    const map = L.map(conteneur.current, {
      scrollWheelZoom: false, // ne capte pas la molette au détriment du scroll de page
      zoomControl: false,
      attributionControl: true,
      // Zoom fractionnaire : sans tuiles, les tracés vectoriels restent nets
      // et fitBounds peut remplir le cadre au plus juste.
      zoomSnap: 0.1,
    })
    map.attributionControl.setPrefix(false)
    map.attributionControl.addAttribution('Contours &copy; <a href="https://github.com/gregoiredavid/france-geojson">france-geojson</a> (OpenStreetMap)')

    const coucheDepartements = L.geoJSON(departements, {
      style: () => ({
        color: '#095228',
        weight: 1,
        opacity: 0.45,
        fillColor: '#e4dcce',
        fillOpacity: 0.4,
        interactive: true,
      }),
      onEachFeature: (feature, couche) => {
        couche.on('mouseover', () => setDeptSurvole(feature.properties.code))
        couche.on('mouseout', () => setDeptSurvole(null))
        couche.on('click', () => {
          setDeptEpingle((courant) => (courant === feature.properties.code ? null : feature.properties.code))
        })
      },
    }).addTo(map)

    map.fitBounds(coucheDepartements.getBounds(), { padding: [6, 6] })
    // La mise en page peut bouger après le montage (polices chargées, flex
    // qui se stabilise, fenêtre redimensionnée…) : on re-mesure et on
    // re-cadre à CHAQUE changement de taille du conteneur. Avec un simple
    // rappel unique, la France restait mal cadrée — voire les points se
    // retrouvaient posés hors de la carte, le cadrage initial ne
    // correspondant plus à la géométrie affichée.
    let derniereLargeur = 0
    let derniereHauteur = 0
    const observateur = new ResizeObserver((entrees) => {
      if (carte.current !== map) return // carte démontée entre-temps
      const taille = entrees[0].contentRect
      if (Math.abs(taille.width - derniereLargeur) < 1 && Math.abs(taille.height - derniereHauteur) < 1) return
      derniereLargeur = taille.width
      derniereHauteur = taille.height
      // La bulle ouverte est positionnée pour l'ancienne vue : refermée avant
      // le recadrage et rouverte après, elle reste collée à son point au lieu
      // de rester en retrait et de sortir de la carte.
      const ouverte = [...marqueurs.current.values()].find((m) => m.isTooltipOpen())
      if (ouverte) ouverte.closeTooltip()
      map.invalidateSize()
      map.fitBounds(coucheDepartements.getBounds(), { padding: [6, 6] })
      if (ouverte) ouvrirBulle(ouverte)
    })
    observateur.observe(conteneur.current)
    carte.current = map
    couche.current = coucheDepartements
    return () => observateur.disconnect()
  }, [])

  // Un clic dans le vide (hors département) désépingle.
  useEffect(() => {
    const map = carte.current
    if (!map) return undefined
    map.on('click', () => setDeptEpingle(null))
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

  // Pose les points quand les positions sont connues, et retire ceux dont
  // l'événement a disparu : le repli local montre d'abord la ligne
  // d'exemple de la maquette (Paris), remplacée par les vrais événements
  // quand Sanity répond — sans nettoyage, le point d'exemple restait posé
  // à côté des points dynamiques.
  useEffect(() => {
    const map = carte.current
    if (!map) return
    const cles = new Set(groupes.map((g) => g.cle))
    marqueurs.current.forEach((marqueur, cle) => {
      if (cles.has(cle)) return
      marqueur.remove()
      marqueurs.current.delete(cle)
    })
    groupes.forEach((groupe) => {
      const coords = positions[groupe.cle]
      if (!coords || marqueurs.current.has(groupe.cle)) return
      const marqueur = L.marker(coords, {
        icon: L.divIcon({
          className: 'carte-leaflet__icone',
          html: '<span class="carte-leaflet__point"></span>',
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        }),
        keyboard: true,
        riseOnHover: true,
      })
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
          ouvrirBulle(marqueur)
        }
      })
      // Le simple survol (ou le focus clavier) ouvre la bulle en interne par
      // Leaflet : on re-mesure sa position au frame suivant pour garantir le
      // centrage au-dessus du point, même si l'ouverture a eu lieu pendant
      // que la mise en page se stabilisait.
      marqueur.on('mouseover focus', () => remesurerBulle(marqueur))
      marqueur.addTo(map)
      marqueurs.current.set(groupe.cle, marqueur)
    })
    // Un point peut avoir été posé pendant que la carte changeait de taille
    // ou de cadrage (géocodage asynchrone) : un recadrage final garantit que
    // tous les points sont repositionnés sur la vue affichée.
    if (couche.current && map.getSize().x > 0) {
      map.invalidateSize()
      map.fitBounds(couche.current.getBounds(), { padding: [6, 6] })
    }
  }, [positions, groupes])

  // États visuels : département actif teinté en vert clair, points allumés
  // quand leur département est actif.
  useEffect(() => {
    if (!couche.current) return
    couche.current.eachLayer((coucheDept) => {
      const actif = coucheDept.feature.properties.code === deptActif
      coucheDept.setStyle({
        fillColor: actif ? '#35985f' : '#e4dcce',
        fillOpacity: actif ? 0.55 : 0.4,
      })
    })
  }, [deptActif, positions])

  useEffect(() => {
    marqueurs.current.forEach((marqueur, cle) => {
      const element = marqueur.getElement()
      if (!element) return
      const groupe = groupes.find((g) => g.cle === cle)
      const allume = groupe?.departements.includes(deptActif)
      element.classList.toggle('est-lit', Boolean(allume))
    })
  }, [deptActif, groupes, positions])

  // Bulle ouverte pour la ligne survolée de la liste (`itemActifId`) ;
  // à la sortie de la liste, elle se referme.
  const bulleListe = useRef(null)
  useEffect(() => {
    if (!itemActifId) {
      if (bulleListe.current && bulleListe.current.isTooltipOpen()) {
        bulleListe.current.closeTooltip()
      }
      bulleListe.current = null
      return
    }
    const groupe = groupes.find((g) => g.items.some((item) => item._id === itemActifId))
    const marqueur = groupe && marqueurs.current.get(groupe.cle)
    if (marqueur) {
      ouvrirBulle(marqueur)
      bulleListe.current = marqueur
    }
  }, [itemActifId, groupes, positions])

  // Nettoyage (démontage).
  useEffect(
    () => () => {
      if (carte.current) {
        carte.current.remove()
        carte.current = null
        couche.current = null
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
