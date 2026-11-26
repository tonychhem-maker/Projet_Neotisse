// La sélection éditoriale reste prioritaire ; les nouveaux formats visibles
// sont ajoutés ensuite sans doublon.
export function orderWorkshopFormats(featured = [], all = []) {
  const seen = new Set()
  return [...featured, ...all].filter(format => {
    if (!format?.id || !format.title || format.visible === false || seen.has(format.id)) return false
    seen.add(format.id)
    return true
  })
}
