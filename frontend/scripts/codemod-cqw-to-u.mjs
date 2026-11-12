// One-shot codemod : remplace les valeurs `Xcqw` des feuilles de style par
// `calc(N * var(--u))`, où N = X * 14.4 = la taille en pixels dans la
// maquette 1440px (les commentaires existants documentent déjà ces pixels).
// `--u` (défini dans index.css) applique le facteur global d'échelle.
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'src')

const { globSync } = await import('node:fs')
const files = globSync(join(root, '**', '*.css')).filter((f) => !f.endsWith('index.css'))

let touched = 0
for (const file of files) {
  const before = readFileSync(file, 'utf8')
  const after = before.replace(/(-?\d*\.?\d+)cqw/g, (match, num) => {
    const px = Math.round(parseFloat(num) * 14.4 * 100) / 100
    return `calc(${px} * var(--u))`
  })
  if (after !== before) {
    writeFileSync(file, after)
    touched += 1
    console.log('converted', file)
  }
}
console.log(`done: ${touched} files`)
