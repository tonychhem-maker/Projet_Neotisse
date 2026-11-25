// Les libellés du Studio peuvent être saisis en capitales ou en minuscules.
// On conserve la casse interne lorsqu'elle est déjà significative.
export function actionLabel(value) {
  if (typeof value !== 'string') return value
  const text = value.trim()
  if (!text) return text
  const normalized = text === text.toLocaleUpperCase('fr') ? text.toLocaleLowerCase('fr') : text
  return normalized.replace(/^\p{L}/u, (letter) => letter.toLocaleUpperCase('fr'))
}
