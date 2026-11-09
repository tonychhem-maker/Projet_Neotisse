# Scripts

## `figma.mjs` — lecture du fichier Figma

Récupère les données du fichier de design via l'API REST Figma.

**Prérequis** : le token personnel Figma doit être présent dans
`~/.secrets/figma-token` (hors dépôt, jamais commité).

```powershell
# Créer le fichier de token (une seule fois)
New-Item -ItemType Directory -Force "$env:USERPROFILE\.secrets"
Set-Content "$env:USERPROFILE\.secrets\figma-token" -Value "figd_VOTRE_TOKEN" -NoNewline
```

### Commandes

| Commande | Rôle |
|---|---|
| `node scripts/figma.mjs <fileKey> --pages` | Liste les pages du fichier |
| `node scripts/figma.mjs <fileKey> --node <nodeId> --depth 4` | Arborescence d'un nœud |
| `node scripts/figma.mjs <fileKey> --tokens` | Couleurs, polices, rayons, ombres utilisés |
| `node scripts/figma.mjs <fileKey> --export <nodeId> --scale 2` | URL PNG d'un nœud |

### Fichier Neotisse

```
fileKey : me6RirseLOnZkL3Ylt9BGa
```

Pages :

| Page | nodeId |
|---|---|
| Agence | `0:1` |
| Wireframe site pour Neotisse | `176:68` |
| maquette néotisse only | `256:620` |
| Neotisse | `122:68` |

### Obtenir un nodeId

Dans Figma : sélectionner un calque → clic droit → **Copy/Paste as** →
**Copy link to selection**. L'URL contient `node-id=256-620`, à convertir en
`256:620` (les tirets deviennent des deux-points).

## Configuration MCP (optionnelle)

`opencode.json` déclare le serveur MCP `figma-developer-mcp`, qui lit le token
depuis la variable d'environnement `FIGMA_API_KEY`. Le script ci-dessus n'en a
pas besoin : il est autonome.
