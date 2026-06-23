#!/usr/bin/env node
/**
 * Pre-submission validation for Cursor Marketplace.
 * Run from angular-standards/: node scripts/validate-marketplace.mjs
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PLUGIN_ROOT = resolve(__dirname, "..");
const REPO_ROOT = resolve(PLUGIN_ROOT, "..");

const errors = [];
const warnings = [];

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf-8"));
}

function requireFile(path, label) {
  if (!existsSync(path)) errors.push(`Missing ${label}: ${path}`);
}

function checkFrontmatter(path, requiredFields) {
  const content = readFileSync(path, "utf-8");
  if (!content.startsWith("---")) {
    errors.push(`Missing YAML frontmatter: ${path}`);
    return;
  }
  const end = content.indexOf("---", 3);
  if (end === -1) {
    errors.push(`Unclosed frontmatter: ${path}`);
    return;
  }
  const fm = content.slice(3, end);
  for (const field of requiredFields) {
    if (!fm.includes(`${field}:`)) {
      errors.push(`Frontmatter missing '${field}': ${path}`);
    }
  }
}

// Repo root files
requireFile(join(REPO_ROOT, "LICENSE"), "LICENSE");
requireFile(join(REPO_ROOT, ".cursor-plugin/marketplace.json"), "marketplace.json");

const marketplace = readJson(join(REPO_ROOT, ".cursor-plugin/marketplace.json"));
if (!marketplace.plugins?.length) errors.push("marketplace.json: plugins array empty");
if (marketplace.owner?.email?.includes("YOUR_EMAIL")) {
  warnings.push("Replace YOUR_EMAIL in marketplace.json before submit");
}

// Plugin manifest
requireFile(join(PLUGIN_ROOT, ".cursor-plugin/plugin.json"), "plugin.json");
const plugin = readJson(join(PLUGIN_ROOT, ".cursor-plugin/plugin.json"));
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(plugin.name)) {
  errors.push(`plugin.json: invalid name '${plugin.name}'`);
}
if (plugin.repository?.includes("YOUR_GITHUB_ORG")) {
  warnings.push("Replace YOUR_GITHUB_ORG in plugin.json before submit");
}

// MCP config — must use npx for marketplace
const mcp = readJson(join(PLUGIN_ROOT, "mcp.json"));
const server = mcp.mcpServers?.["angular-standards"];
if (!server) errors.push("mcp.json: missing angular-standards server");
if (server?.command !== "npx") {
  errors.push("mcp.json: command must be 'npx' for public marketplace (not local node path)");
}
if (!server?.args?.includes("angular-standards-mcp")) {
  errors.push("mcp.json: args must include published npm package name");
}
if (JSON.stringify(mcp).includes("workspaceFolder") || JSON.stringify(mcp).includes("dist/index.js")) {
  errors.push("mcp.json: remove dev-machine paths before marketplace submit");
}

// MCP server build
requireFile(join(PLUGIN_ROOT, "mcp-server/dist/index.js"), "built MCP server");
requireFile(join(PLUGIN_ROOT, "mcp-server/standards/01-component-architecture.md"), "bundled standards");

const mcpPkg = readJson(join(PLUGIN_ROOT, "mcp-server/package.json"));
if (mcpPkg.repository?.url?.includes("YOUR_GITHUB_ORG")) {
  warnings.push("Replace YOUR_GITHUB_ORG in mcp-server/package.json before npm publish");
}
if (mcpPkg.private === true) errors.push("mcp-server/package.json: remove private:true before publish");

// Rules, skills, commands
for (const rule of ["angular-components.mdc", "angular-rxjs.mdc", "angular-accessibility.mdc"]) {
  const p = join(PLUGIN_ROOT, "rules", rule);
  requireFile(p, `rule ${rule}`);
  if (existsSync(p)) checkFrontmatter(p, ["description"]);
}

checkFrontmatter(join(PLUGIN_ROOT, "skills/angular-pr-review/SKILL.md"), ["name", "description"]);
checkFrontmatter(join(PLUGIN_ROOT, "commands/angular-review.md"), ["name", "description"]);

requireFile(join(PLUGIN_ROOT, "README.md"), "README");
requireFile(join(PLUGIN_ROOT, "CHANGELOG.md"), "CHANGELOG");

console.log("Angular Standards — Marketplace validation\n");

if (warnings.length) {
  console.log("Warnings:");
  warnings.forEach((w) => console.log(`  ⚠ ${w}`));
  console.log();
}

if (errors.length) {
  console.log("Errors (fix before submit):");
  errors.forEach((e) => console.log(`  ✗ ${e}`));
  process.exit(1);
}

console.log("✓ All checks passed. Ready for npm publish + marketplace submit.");
console.log("  Next: PUBLIC_LAUNCH.md");
