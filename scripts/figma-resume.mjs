// Synthétise l'arborescence d'un nœud Figma : une ligne par nœud avec
// position relative à la frame, taille, style de texte et contenu.
// Usage : node scripts/figma-resume.mjs <fileKey> <nodeId> <originX> <originY> [--depth N]
import { readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

const token = readFileSync(join(homedir(), '.secrets', 'figma-token'), 'utf8').trim()
const [fileKey, nodeId, ox, oy, ...rest] = process.argv.slice(2)
const depthIdx = rest.indexOf('--depth')
const depth = depthIdx >= 0 ? Number(rest[depthIdx + 1]) : 8

async function api(path) {
  const res = await fetch(`https://api.figma.com${path}`, { headers: { 'X-Figma-Token': token } })
  if (!res.ok) throw new Error(`Figma ${res.status} : ${(await res.text()).slice(0, 300)}`)
  return res.json()
}

const originX = Number(ox)
const originY = Number(oy)
const hex = ({ r, g, b, a }) => {
  const to = (v) => Math.round(v * 255).toString(16).padStart(2, '0')
  const base = `#${to(r)}${to(g)}${to(b)}`.toUpperCase()
  return a !== undefined && a < 1 ? `${base}${Math.round(a * 255)}` : base
}

function ligne(n, prof) {
  const b = n.absoluteBoundingBox ?? {}
  const x = b.x !== undefined ? Math.round(b.x - originX) : '?'
  const y = b.y !== undefined ? Math.round(b.y - originY) : '?'
  const w = b.width !== undefined ? Math.round(b.width) : '?'
  const h = b.height !== undefined ? Math.round(b.height) : '?'
  const rot = n.rotation ? ` rot${n.rotation.toFixed(2)}rad` : ''
  let fill = ''
  const f = (n.fills ?? []).find((x2) => x2.type === 'SOLID' && x2.visible !== false)
  if (f) fill = ` fill:${hex(f.color)}`
  let txt = ''
  if (n.type === 'TEXT') {
    const s = n.style ?? {}
    txt = ` "${(n.characters ?? '').replace(/\n/g, '⏎').slice(0, 60)}" [${s.fontFamily} ${s.fontWeight} ${s.fontSize}px lh${s.lineHeightPx ? Math.round(s.lineHeightPx) : '?'} ls${s.letterSpacing ?? 0}${s.textCase ? ' ' + s.textCase : ''}${n.fills?.[0]?.color ? ' ' + hex(n.fills[0].color) : ''}]`
  }
  const op = n.opacity !== undefined && n.opacity < 1 ? ` op${n.opacity}` : ''
  console.log(`${'  '.repeat(prof)}${n.type} ${n.id} "${n.name}" @(${x},${y}) ${w}×${h}${rot}${fill}${op}${txt}`)
  for (const c of n.children ?? []) ligne(c, prof + 1)
}

const data = await api(`/v1/files/${fileKey}/nodes?ids=${nodeId}&depth=${depth}`)
const node = data.nodes?.[nodeId]?.document
if (!node) { console.error('node introuvable'); process.exit(1) }
const b = node.absoluteBoundingBox ?? {}
console.log(`FRAME ${node.name} (${node.id}) origine absolute (${b.x}, ${b.y}) ${b.width}×${b.height}`)
for (const c of node.children ?? []) ligne(c, 0)
