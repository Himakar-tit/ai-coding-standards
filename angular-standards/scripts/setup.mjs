#!/usr/bin/env node
/**
 * Install angular-standards MCP + instruction files into a target Angular workspace.
 *
 * Usage:
 *   node scripts/setup.mjs --target /path/to/angular-app --host all
 *   node scripts/setup.mjs --target . --host cursor|vscode|claude-code|claude-desktop|copilot|all
 */
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { platform } from "node:os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PLUGIN_ROOT = resolve(__dirname, "..");
const MCP_ENTRY = resolve(PLUGIN_ROOT, "mcp-server/dist/index.js");

const SERVER_NAME = "angular-standards";

function parseArgs(argv) {
  const args = { target: process.cwd(), host: "all", nodeCommand: "node" };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === "--target" && argv[i + 1]) args.target = resolve(argv[++i]);
    else if (argv[i] === "--host" && argv[i + 1]) args.host = argv[++i];
    else if (argv[i] === "--node" && argv[i + 1]) args.nodeCommand = argv[++i];
    else if (argv[i] === "--help") {
      console.log(`Usage: node scripts/setup.mjs [--target DIR] [--host all|cursor|vscode|claude-code|claude-desktop|copilot]`);
      process.exit(0);
    }
  }
  return args;
}

function ensureBuilt() {
  if (!existsSync(MCP_ENTRY)) {
    console.error("MCP server not built. Run: cd mcp-server && npm install && npm run build");
    process.exit(1);
  }
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

function setupCursor(target, entry, nodeCommand) {
  mergeJson(join(target, ".cursor/mcp.json"), (existing) => ({
    mcpServers: {
      ...(existing.mcpServers ?? {}),
      [SERVER_NAME]: {
        command: nodeCommand,
        args: [entry.replace(/\\/g, "/")],
        env: { ANGULAR_STANDARDS_ROOT: resolve(PLUGIN_ROOT, "standards").replace(/\\/g, "/") },
      },
    },
  }));
}

function setupVsCode(target, entry, nodeCommand) {
  mergeJson(join(target, ".vscode/mcp.json"), (existing) => ({
    servers: {
      ...(existing.servers ?? {}),
      [SERVER_NAME]: {
        type: "stdio",
        command: nodeCommand,
        args: [entry.replace(/\\/g, "/")],
        env: { ANGULAR_STANDARDS_ROOT: resolve(PLUGIN_ROOT, "standards").replace(/\\/g, "/") },
      },
    },
  }));
}

function setupClaudeCode(target, entry, nodeCommand) {
  mergeJson(join(target, ".mcp.json"), (existing) => ({
    mcpServers: {
      ...(existing.mcpServers ?? {}),
      [SERVER_NAME]: {
        type: "stdio",
        command: nodeCommand,
        args: [`\${CLAUDE_PROJECT_DIR:-.}/.mcp/angular-standards-entry.mjs`],
      },
    },
  }));

  mkdirSync(join(target, ".mcp"), { recursive: true });
  const shim = `import { spawn } from "node:child_process";

const entry = ${JSON.stringify(entry.replace(/\\/g, "/"))};
const standards = ${JSON.stringify(resolve(PLUGIN_ROOT, "standards").replace(/\\/g, "/"))};
const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();

const child = spawn(${JSON.stringify(nodeCommand)}, [entry], {
  stdio: "inherit",
  env: { ...process.env, ANGULAR_STANDARDS_ROOT: standards },
  cwd: root,
});
child.on("exit", (code) => process.exit(code ?? 1));
`;
  writeFileSync(join(target, ".mcp/angular-standards-entry.mjs"), shim, "utf-8");
  console.log("Wrote", join(target, ".mcp/angular-standards-entry.mjs"));
}

function setupClaudeDesktop(entry, nodeCommand) {
  const configPaths = {
    win32: join(process.env.APPDATA ?? "", "Claude", "claude_desktop_config.json"),
    darwin: join(process.env.HOME ?? "", "Library/Application Support/Claude/claude_desktop_config.json"),
    linux: join(process.env.HOME ?? "", ".config/Claude/claude_desktop_config.json"),
  };
  const configPath = configPaths[platform()] ?? configPaths.linux;

  mergeJson(configPath, (existing) => ({
    ...(existing.mcpServers ? existing : {}),
    mcpServers: {
      ...(existing.mcpServers ?? {}),
      [SERVER_NAME]: {
        command: nodeCommand,
        args: [entry.replace(/\\/g, "/")],
        env: { ANGULAR_STANDARDS_ROOT: resolve(PLUGIN_ROOT, "standards").replace(/\\/g, "/") },
      },
    },
  }));
  console.log("Restart Claude Desktop after editing claude_desktop_config.json");
}

function setupCopilotInstructions(target) {
  const githubDir = join(target, ".github");
  const instructionsDir = join(githubDir, "instructions");
  mkdirSync(instructionsDir, { recursive: true });

  cpSync(join(PLUGIN_ROOT, "templates/copilot-instructions.md"), join(githubDir, "copilot-instructions.md"));
  cpSync(join(PLUGIN_ROOT, "templates/angular.instructions.md"), join(instructionsDir, "angular.instructions.md"));
  cpSync(join(PLUGIN_ROOT, "templates/CLAUDE.md"), join(target, "CLAUDE.md"));
  console.log("Wrote Copilot + Claude instruction files");
}

const { target, host, nodeCommand } = parseArgs(process.argv);
ensureBuilt();

const entry = MCP_ENTRY;
const hosts = host === "all" ? ["cursor", "vscode", "claude-code", "claude-desktop", "copilot"] : [host];

for (const h of hosts) {
  switch (h) {
    case "cursor":
      setupCursor(target, entry, nodeCommand);
      break;
    case "vscode":
      setupVsCode(target, entry, nodeCommand);
      break;
    case "claude-code":
      setupClaudeCode(target, entry, nodeCommand);
      break;
    case "claude-desktop":
      setupClaudeDesktop(entry, nodeCommand);
      break;
    case "copilot":
      setupCopilotInstructions(target);
      break;
    default:
      console.error("Unknown host:", h);
      process.exit(1);
  }
}

console.log("\nDone. MCP tools: list_standards_sections, get_standards_section, get_pr_review_brief, get_review_sections_for_diff, scan_angular_violations");
