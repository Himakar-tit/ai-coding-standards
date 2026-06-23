# Public Cursor Marketplace Launch

Launch **only** on the public [Cursor Marketplace](https://cursor.com/marketplace). Open source, public npm, manual Cursor review.

## Architecture

```
npm (angular-standards-mcp)     ← MCP runtime (npx)
        ↑
Cursor Marketplace plugin     ← rules, skills, commands, mcp.json
        ↑
Public GitHub repo            ← mandatory for marketplace
```

Users install from Cursor Marketplace → plugin loads → MCP starts via `npx -y angular-standards-mcp`.

---

## Prerequisites

| Item | Action |
|------|--------|
| **GitHub org/user** | Public repo `ai-coding-standards` |
| **npm account** | https://www.npmjs.com/signup |
| **Package name** | `angular-standards-mcp` (check availability on npm) |
| **License** | MIT — included at repo root |
| **Cursor account** | For marketplace submission |

---

## Step-by-step launch

### 1. Replace placeholders in repo

Search and replace `Himakar-tit` and `Himakar-tit@users.noreply.github.com` in:

- `.cursor-plugin/marketplace.json`
- `angular-standards/.cursor-plugin/plugin.json`
- `angular-standards/mcp-server/package.json`

### 2. Verify package name on npm

```bash
npm view angular-standards-mcp
```

If taken, pick another name (e.g. `cursor-angular-standards-mcp`) and update:

- `mcp-server/package.json` → `name`
- `angular-standards/mcp.json` → `args` array

### 3. Build and dry-run pack

```bash
cd angular-standards/mcp-server
npm install
npm run build
npm pack --dry-run
node ../scripts/validate-marketplace.mjs
```

Expected tarball contents: `dist/`, `standards/`, `package.json`.

### 4. Publish to public npm (required before marketplace)

```bash
npm login
npm publish --access public
```

Verify:

```bash
npx -y angular-standards-mcp
# Blocks on stdio — correct. Ctrl+C to exit.
```

### 5. Push public GitHub repository

```bash
git init   # if not already
git add .
git commit -m "chore: prepare angular-standards for public marketplace launch"
git remote add origin https://github.com/Himakar-tit/ai-coding-standards.git
git push -u origin main
```

Confirm repo is **public** and includes:

- [x] `LICENSE`
- [x] `.cursor-plugin/marketplace.json`
- [x] `angular-standards/.cursor-plugin/plugin.json`
- [x] `angular-standards/mcp.json` (uses `npx`, not local paths)
- [x] `angular-standards/README.md`
- [x] `angular-standards/CHANGELOG.md`

### 6. Test locally in Cursor before submitting

1. Cursor → install plugin from folder or clone repo
2. Settings → MCP → `angular-standards` green dot
3. Agent sees 5 tools
4. Run `/angular-review` or ask agent to call `list_standards_sections`

### 7. Submit to Cursor Marketplace

1. Open https://cursor.com/marketplace/publish
2. Submit: `https://github.com/Himakar-tit/ai-coding-standards`
3. Include in submission notes:

```
Plugin: angular-standards (in angular-standards/)

MCP package: angular-standards-mcp on public npm (npx -y angular-standards-mcp)

MCP tools (read-only):
- list_standards_sections
- get_standards_section
- get_pr_review_brief
- get_review_sections_for_diff
- scan_angular_violations

Security:
- No network requests
- No file system writes
- No secrets required
- Standards loaded from bundled markdown files

Composes with @angular/cli mcp (get_best_practices) — does not duplicate official docs.

License: MIT
```

4. Wait for manual review (~1 week typical)

### 8. After approval

- Announce internally / on social
- Tag release: `git tag v0.1.0 && git push origin v0.1.0`
- Monitor issues on GitHub

---

## Publishing updates

```bash
# 1. Bump versions (keep in sync)
#    angular-standards/mcp-server/package.json
#    angular-standards/.cursor-plugin/plugin.json
#    .cursor-plugin/marketplace.json plugins[].version

# 2. Update CHANGELOG.md

# 3. Publish npm
cd angular-standards/mcp-server && npm publish

# 4. Push git — Cursor re-reviews marketplace update
git push origin main
```

---

## Marketplace rejection risks (avoid)

| Risk | Mitigation |
|------|------------|
| Not open source | MIT `LICENSE` committed |
| MCP uses dev paths | `mcp.json` uses `npx -y angular-standards-mcp` |
| npm package missing | Publish npm **before** marketplace submit |
| Invalid manifest | Run `node scripts/validate-marketplace.mjs` |
| Writes files / network | MCP is read-only — state in submission |
| Missing frontmatter | All rules/skills/commands have YAML frontmatter |

---

## What is NOT in public marketplace scope

This launch path does **not** include:

- Private npm / GitHub Packages
- Internal `setup.mjs` rollout (optional for consumers, not required for marketplace)
- Copilot-specific files (plugin is Cursor-only; MCP npm package works elsewhere if users configure manually)

Focus: **Cursor Marketplace one-click install**.

---

## Quick command reference

```bash
# Full pre-submit validation
cd angular-standards/mcp-server && npm run build && npm pack --dry-run
node ../scripts/validate-marketplace.mjs

# Publish
npm publish --access public

# Submit
# https://cursor.com/marketplace/publish
```
