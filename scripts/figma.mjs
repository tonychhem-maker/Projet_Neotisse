// Récupère les données Figma via l'API REST.
// Le token est lu depuis ~/.secrets/figma-token (jamais dans le dépôt).
//
// Usage :
//   node scripts/figma.mjs <fileKey> --pages
//   node scripts/figma.mjs <fileKey> --node <nodeId> [--depth N]
//   node scripts/figma.mjs <fileKey> --tokens
//   node scripts/figma.mjs <fileKey> --export <nodeId> [--scale 1]
//
// Sortie : JSON sur stdout.

import { readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

const tokenFile = join(homedir(), '.secrets', 'figma-token')

function readToken() {
  try {
    return readFileSync(tokenFile, 'utf8').trim()
  } catch {
    console.error(`Token Figma introuvable : ${tokenFile}`)
    console.error('Créez ce fichier avec votre personal access token (figd_...).')
    process.exit(1)
  }
}

async function api(path, token) {
  const res = await fetch(`https://api.figma.com${path}`, {
    headers: { 'X-Figma-Token': token },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Figma ${res.status} : ${text.slice(0, 300)}`)
  }
  return res.json()
}

function walk(node, visit) {
  visit(node)
  for (const child of node.children ?? []) walk(child, visit)
}

function hex({ r, g, b, a }) {
  const to = (v) => Math.round(v * 255).toString(16).padStart(2, '0')
  const base = `#${to(r)}${to(g)}${to(b)}`.toUpperCase()
  return a !== undefined && a < 1 ? `${base}${Math.round(a * 255).toString(16).padStart(2, '0')}` : base
}

function topEntries(map, limit) {
  return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit)
}

async function main() {
  const [fileKey, flag, ...rest] = process.argv.slice(2)
  if (!fileKey || !flag) {
    console.error('Usage : node scripts/figma.mjs <fileKey> --pages|--node|--tokens|--export [args]')
    process.exit(1)
  }
  const token = readToken()

  if (flag === '--pages') {
    const file = await api(`/v1/files/${fileKey}?depth=1`, token)
    console.log(
      JSON.stringify(
        (file.document?.children ?? []).map((c) => ({
          id: c.id,
          name: c.name,
          type: c.type,
        })),
        null,
        2,
      ),
    )
    return
  }

  if (flag === '--node') {
    const nodeId = rest[0]
    const depthIndex = rest.indexOf('--depth')
    const depth = depthIndex >= 0 ? Number(rest[depthIndex + 1]) : 4
    const data = await api(`/v1/files/${fileKey}/nodes?ids=${nodeId}&depth=${depth}`, token)
    const node = data.nodes?.[nodeId]?.document
    console.log(
      JSON.stringify(
        node
          ? {
              id: node.id,
              name: node.name,
              type: node.type,
              size: [node.absoluteBoundingBox?.width, node.absoluteBoundingBox?.height],
              children: node.children ?? [],
            }
          : { error: 'node introuvable' },
        null,
        2,
      ),
    )
    return
  }

  if (flag === '--tokens') {
    const data = await api(`/v1/files/${fileKey}?depth=10`, token)
    const colors = new Map()
    const fonts = new Map()
    const radii = new Map()
    const shadows = new Map()
    let nodes = 0

    walk(data.document, (n) => {
      nodes++
      for (const fill of n.fills ?? []) {
        if (fill.type === 'SOLID' && fill.visible !== false) {
          const key = hex(fill.color)
          colors.set(key, (colors.get(key) ?? 0) + 1)
        }
      }
      if (n.type === 'TEXT' && n.style) {
        const s = n.style
        const key = `${s.fontFamily}|${s.fontWeight}|${s.fontSize}px|lh ${s.lineHeightPx ? Math.round(s.lineHeightPx) : '?'}`
        fonts.set(key, (fonts.get(key) ?? 0) + 1)
      }
      if (n.cornerRadius) radii.set(n.cornerRadius, (radii.get(n.cornerRadius) ?? 0) + 1)
      for (const effect of n.effects ?? []) {
        if (effect.type === 'DROP_SHADOW' && effect.visible !== false) {
          const key = `${hex(effect.color)} ${effect.offset?.x ?? 0}x${effect.offset?.y ?? 0} blur ${effect.radius}`
          shadows.set(key, (shadows.get(key) ?? 0) + 1)
        }
      }
    })

    console.log(
      JSON.stringify(
        {
          nodes,
          colors: topEntries(colors, 25),
          fonts: topEntries(fonts, 25),
          radii: topEntries(radii, 12),
          shadows: topEntries(shadows, 8),
        },
        null,
        2,
      ),
    )
    return
  }

  if (flag === '--export') {
    const nodeId = rest[0]
    const scaleIndex = rest.indexOf('--scale')
    const scale = scaleIndex >= 0 ? rest[scaleIndex + 1] : '1'
    const formatIndex = rest.indexOf('--format')
    const format = formatIndex >= 0 ? rest[formatIndex + 1] : 'png'
    const res = await api(`/v1/images/${fileKey}?ids=${nodeId}&format=${format}&scale=${scale}`, token)
    console.log(JSON.stringify(res, null, 2))
    return
  }

  console.error(`Option inconnue : ${flag}`)
  process.exit(1)
}

main().catch((error) => {
  console.error(String(error.message ?? error))
  process.exit(1)
})
