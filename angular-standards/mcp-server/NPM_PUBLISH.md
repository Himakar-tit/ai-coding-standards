# Publish to npm

Package: **`angular-standards-mcp`** (public, unscoped)

## One-time setup

1. Create account: https://www.npmjs.com/signup
2. Login:

```bash
npm login
```

3. Verify:

```bash
npm whoami
```

## Publish (from this directory)

```bash
cd angular-standards/mcp-server
npm install
npm run build
npm pack --dry-run    # preview tarball contents
npm publish --access public
```

## Verify publish

```bash
npm view angular-standards-mcp
npx -y angular-standards-mcp   # starts stdio MCP (Ctrl+C to exit)
```

npm page: https://www.npmjs.com/package/angular-standards-mcp

## Use in other Angular repos

### Option A — one-shot setup (no package.json change)

```bash
cd your-angular-app
npx angular-standards-setup
```

### Option B — devDependency (team repos)

```bash
npm install --save-dev angular-standards-mcp
```

Add to `package.json`:

```json
{
  "scripts": {
    "setup:angular-standards": "angular-standards-setup"
  }
}
```

Run after clone:

```bash
npm run setup:angular-standards
```

### Option C — MCP only (no instruction files)

Add to `.cursor/mcp.json` or `.vscode/mcp.json`:

```json
"command": "npx",
"args": ["-y", "angular-standards-mcp"]
```

## Publish updates

1. Bump `version` in `package.json` (semver)
2. Update `CHANGELOG.md`
3. `npm publish --access public`
4. `git tag angular-standards-mcp-v0.1.2 && git push origin tag`

## Troubleshooting

| Error | Fix |
|-------|-----|
| `ENEEDAUTH` | Run `npm login` |
| `403 Forbidden` | Package name owned by another user — change `name` in package.json |
| `402 Payment Required` | Use `--access public` for unscoped packages |
