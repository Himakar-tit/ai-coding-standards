#!/usr/bin/env node
/**
 * Install angular-standards MCP + host-specific instructions into an Angular workspace.
 *
 * Usage:
 *   npx angular-standards-setup --target /path/to/angular-app
 *   node scripts/setup.mjs --host copilot|claude-code|claude-desktop|cursor|all
 *
 * Default: npx angular-standards-mcp (public npm). Use --local for git-clone dev paths.
 */
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { platform } from "node:os";

const SERVER_NAME = "angular-standards";
const NPM_PACKAGE = "angular-standards-mcp";

function resolvePackageRoot() {
  const here = dirname(fileURLToPath(import.meta.url));
  const mcpServerRoot = resolve(here, "..");
  if (existsSync(join(mcpServerRoot, "standards"))) return mcpServerRoot;
  const pluginRoot = resolve(here, "../../mcp-server");
  if (existsSync(join(pluginRoot, "standards"))) return pluginRoot;
  throw new Error("Could not locate angular-standards-mcp package root.");
}

function resolvePluginRoot(packageRoot) {
  const parent = resolve(packageRoot, "..");
  if (existsSync(join(parent, "templates"))) return parent;
  if (existsSync(join(packageRoot, "templates"))) return packageRoot;
  return parent;
}

function parseArgs(argv) {
  const args = {
    target: process.cwd(),
    host: "all",
    mode: "npx",
    nodeCommand: "node",
    npxCommand: "npx",
  };

  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--target" && argv[i + 1]) args.target = resolve(argv[++i]);
    else if (arg === "--host" && argv[i + 1]) args.host = argv[++i];
    else if (arg === "--local") args.mode = "local";
    else if (arg === "--node" && argv[i + 1]) args.nodeCommand = argv[++i];
    else if (arg === "--npx" && argv[i + 1]) args.npxCommand = argv[++i];
    else if (arg === "--help") {
      console.log(`
angular-standards-setup — install MCP for Cursor, GitHub Copilot, Claude Code, Claude Desktop

Options:
  --target <dir>   Angular workspace root (default: cwd)
  --host <host>    cursor | copilot | vscode | claude-code | claude | claude-desktop | all
  --local          Use local mcp-server/dist (git clone) instead of npx
  --node <cmd>     Node executable for --local mode
  --npx <cmd>      npx executable for published package mode

Examples:
  npx angular-standards-setup --target ./my-angular-app
  node scripts/setup.mjs --host copilot --target ./my-angular-app
  node scripts/setup.mjs --host claude-code --local
`);
      process.exit(0);
    }
  }

  return args;
}

function writeJson(path, data) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, "utf-8");
  console.log("Wrote", path);
}

function mergeJson(path, mergeFn) {
  const existing = existsSync(path) ? JSON.parse(readFileSync(path, "utf-8")) : {};
  writeJson(path, mergeFn(existing));
}

function npxServerEntry(npxCommand) {
  return {
    command: npxCommand,
    args: ["-y", NPM_PACKAGE],
  };
}

function localServerEntry(packageRoot, nodeCommand) {
  const entry = join(packageRoot, "dist/index.js").replace(/\\/g, "/");
  const standards = join(packageRoot, "standards").replace(/\\/g, "/");
  return {
    command: nodeCommand,
    args: [entry],
    env: { ANGULAR_STANDARDS_ROOT: standards },
  };
}

function resolveServerConfig(mode, packageRoot, nodeCommand, npxCommand) {
  if (mode === "local") {
    const entry = join(packageRoot, "dist/index.js");
    if (!existsSync(entry)) {
      console.error("Local MCP not built. Run: cd mcp-server && npm install && npm run build");
      console.error("Or omit --local to use npx (requires npm publish or npm link).");
      process.exit(1);
    }
    return localServerEntry(packageRoot, nodeCommand);
  }
  return npxServerEntry(npxCommand);
}

function setupCursor(target, server) {
  mergeJson(join(target, ".cursor/mcp.json"), (existing) => ({
    mcpServers: {
      ...(existing.mcpServers ?? {}),
      [SERVER_NAME]: server,
    },
  }));
}

function setupVsCodeCopilot(target, server) {
  mergeJson(join(target, ".vscode/mcp.json"), (existing) => ({
    servers: {
      ...(existing.servers ?? {}),
      [SERVER_NAME]: {
        type: "stdio",
        ...server,
      },
    },
  }));
}

function setupClaudeCode(target, server) {
  mergeJson(join(target, ".mcp.json"), (existing) => ({
    mcpServers: {
      ...(existing.mcpServers ?? {}),
      [SERVER_NAME]: {
        type: "stdio",
        ...server,
      },
    },
  }));
}

function setupClaudeDesktop(server, nodeCommand, npxCommand, mode, packageRoot) {
  const configPaths = {
    win32: join(process.env.APPDATA ?? "", "Claude", "claude_desktop_config.json"),
    darwin: join(process.env.HOME ?? "", "Library/Application Support/Claude/claude_desktop_config.json"),
    linux: join(process.env.HOME ?? "", ".config/Claude/claude_desktop_config.json"),
  };
  const configPath = configPaths[platform()] ?? configPaths.linux;

  let desktopServer = server;
  if (mode === "npx") {
    desktopServer = npxServerEntry(npxCommand);
  } else {
    desktopServer = localServerEntry(packageRoot, nodeCommand);
  }

  mergeJson(configPath, (existing) => ({
    ...existing,
    mcpServers: {
      ...(existing.mcpServers ?? {}),
      [SERVER_NAME]: desktopServer,
    },
  }));
  console.log("Restart Claude Desktop after editing:", configPath);
}

function installInstructions(target, pluginRoot) {
  const templatesDir = join(pluginRoot, "templates");
  if (!existsSync(templatesDir)) {
    console.warn("Templates not found at", templatesDir);
    return;
  }

  const githubDir = join(target, ".github");
  const instructionsDir = join(githubDir, "instructions");
  mkdirSync(instructionsDir, { recursive: true });

  cpSync(join(templatesDir, "copilot-instructions.md"), join(githubDir, "copilot-instructions.md"));
  cpSync(join(templatesDir, "angular.instructions.md"), join(instructionsDir, "angular.instructions.md"));
  if (existsSync(join(templatesDir, "angular-pr-review.instructions.md"))) {
    cpSync(
      join(templatesDir, "angular-pr-review.instructions.md"),
      join(instructionsDir, "angular-pr-review.instructions.md")
    );
  }
  cpSync(join(templatesDir, "CLAUDE.md"), join(target, "CLAUDE.md"));

  if (existsSync(join(templatesDir, "AGENTS.md"))) {
    cpSync(join(templatesDir, "AGENTS.md"), join(target, "AGENTS.md"));
  }

  console.log("Wrote Copilot + Claude instruction files (.github/, CLAUDE.md, AGENTS.md)");
}

function expandHosts(host) {
  const map = {
    all: ["cursor", "copilot", "claude-code", "claude-desktop"],
    copilot: ["copilot"],
    vscode: ["copilot"],
    claude: ["claude-code", "claude-desktop"],
    cursor: ["cursor"],
    "claude-code": ["claude-code"],
    "claude-desktop": ["claude-desktop"],
  };
  return map[host] ?? [host];
}

const PACKAGE_ROOT = resolvePackageRoot();
const PLUGIN_ROOT = resolvePluginRoot(PACKAGE_ROOT);
const { target, host, mode, nodeCommand, npxCommand } = parseArgs(process.argv);
const server = resolveServerConfig(mode, PACKAGE_ROOT, nodeCommand, npxCommand);
const hosts = expandHosts(host);

for (const h of hosts) {
  switch (h) {
    case "cursor":
      setupCursor(target, server);
      break;
    case "copilot":
      setupVsCodeCopilot(target, server);
      installInstructions(target, PLUGIN_ROOT);
      break;
    case "claude-code":
      setupClaudeCode(target, server);
      installInstructions(target, PLUGIN_ROOT);
      break;
    case "claude-desktop":
      setupClaudeDesktop(server, nodeCommand, npxCommand, mode, PACKAGE_ROOT);
      break;
    default:
      console.error("Unknown host:", h);
      process.exit(1);
  }
}

console.log(`
Done (${mode} mode).

MCP tools: list_standards_sections, get_standards_section, get_pr_review_brief,
           get_review_sections_for_diff, scan_angular_violations

Next steps:
  • GitHub Copilot (VS Code): Reload window → Copilot Chat agent mode → verify MCP server
  • Claude Code: approve project MCP on first run (claude mcp list)
  • Claude Desktop: fully quit and restart the app
  • Cursor: Settings → MCP → green dot on angular-standards
`);
