/**
 * Formate une date ISO en « octobre 2027 » (mois + année de la carte).
 * On garde la partie calendrier UTC de la date, placée à midi local pour
 * que les fuseaux négatifs ne la fassent pas reculer d'un jour.
 */
export function formatMoisAnnee(iso) {
  if (!iso) return null
  const date = new Date(`${String(iso).slice(0, 10)}T12:00:00`)
  if (Number.isNaN(date.getTime())) return null
  return new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(date)
}

/**
 * Formate une date ISO (YYYY-MM-DD) en « Le 2 novembre 2027 » (ligne des
 * déplacements). Le midi évite que les fuseaux négatifs ne reculent la date
 * d'un jour.
 */
export function formatDateComplete(iso) {
  if (!iso) return null
  const date = new Date(`${iso}T12:00:00`)
  if (Number.isNaN(date.getTime())) return null
  return `Le ${new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)}`
}
