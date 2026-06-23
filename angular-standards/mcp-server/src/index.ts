#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { resolveStandardsDir } from "./paths.js";

const STANDARDS_DIR = resolveStandardsDir();

type StandardSection =
  | "architecture"
  | "modern-angular"
  | "rxjs"
  | "typescript"
  | "performance"
  | "accessibility"
  | "styling"
  | "testing"
  | "security"
  | "governance"
  | "operations"
  | "review-format"
  | "anti-patterns";

const SECTION_FILES: Record<StandardSection, string> = {
  architecture: "01-component-architecture.md",
  "modern-angular": "02-modern-angular.md",
  rxjs: "03-rxjs-reactive.md",
  typescript: "04-typescript.md",
  performance: "05-performance.md",
  accessibility: "06-accessibility.md",
  styling: "07-styling.md",
  testing: "08-testing.md",
  security: "09-security.md",
  governance: "10-governance-ngrx.md",
  operations: "11-operations.md",
  "review-format": "12-review-output-format.md",
  "anti-patterns": "13-anti-patterns.md",
};

const SECTION_SUMMARIES: Record<StandardSection, string> = {
  architecture: "Smart/presentational separation, collection vs item, decomposition",
  "modern-angular": "Signals, OnPush, @if/@for, zoneless-friendly patterns",
  rxjs: "Stream composition, takeUntilDestroyed, no side effects in map",
  typescript: "Strict typing, immutability, domain models",
  performance: "Stable references, minimal rerender, memoized derived state",
  accessibility: "WCAG: semantic HTML, keyboard, ARIA, focus management",
  styling: "Design tokens, encapsulation, no hardcoded constants",
  testing: "Critical paths, loading/empty/error states",
  security: "XSS prevention, safe rendering, production logging",
  governance: "Feature flags, NgRx effects, domain boundaries",
  operations: "Resiliency, race conditions, observability",
  "review-format": "Mandatory PR review output structure and severity classes",
  "anti-patterns": "Consolidated reject list across all domains",
};

function readSection(section: StandardSection): string {
  const filePath = join(STANDARDS_DIR, SECTION_FILES[section]);
  if (!existsSync(filePath)) {
    throw new Error(`Standards file missing: ${SECTION_FILES[section]}`);
  }
  return readFileSync(filePath, "utf-8");
}

function scanAngularSource(source: string, filePath: string): string[] {
  const violations: string[] = [];
  const checks: Array<{ pattern: RegExp; message: string }> = [
    { pattern: /\*ngIf\b/, message: "Legacy *ngIf — use @if" },
    { pattern: /\*ngFor\b/, message: "Legacy *ngFor — use @for with track" },
    { pattern: /\*ngSwitch\b/, message: "Legacy *ngSwitch — use @switch" },
    { pattern: /ChangeDetectionStrategy\.Default/, message: "Default change detection — require OnPush" },
    { pattern: /\.subscribe\s*\(/g, message: "Manual subscribe — prefer async pipe, signals, or takeUntilDestroyed" },
    { pattern: /subs\.sink|Subscription\[\]|new Subscription\(\)/, message: "Manual subscription aggregation anti-pattern" },
    { pattern: /:\s*any\b|<any>|as any/, message: "Unsafe any usage" },
    { pattern: /\[innerHTML\]/, message: "innerHTML binding — verify sanitization" },
    { pattern: /<div[^>]*\(click\)=/, message: "Click handler on div — use button or add full a11y contract" },
    { pattern: /<span[^>]*\(click\)=/, message: "Click handler on span — use button or add full a11y contract" },
    { pattern: /@Input\(\)|@Output\(\)/, message: "Legacy @Input/@Output — prefer input()/output()" },
    { pattern: /ngOnInit\s*\(\)\s*\{[^}]*\.dispatch\(/s, message: "Dispatch in lifecycle — move orchestration to Effects" },
    { pattern: /\.pipe\([^)]*map\([^)]*\{[^}]*(this\.|dispatch|console\.)/s, message: "Possible side effect inside map()" },
  ];

  for (const { pattern, message } of checks) {
    if (pattern.test(source)) {
      violations.push(message);
    }
  }

  if (source.includes("@Component") && !source.includes("ChangeDetectionStrategy.OnPush")) {
    violations.push("Component missing ChangeDetectionStrategy.OnPush");
  }

  if (source.includes("@for") && !source.includes("track ")) {
    violations.push("@for missing stable track expression");
  }

  if (/template:\s*`[\s\S]{3000,}/.test(source)) {
    violations.push("Inline template exceeds ~3000 chars — extract presentational components");
  }

  return violations.map((v) => `[${filePath}] ${v}`);
}

const server = new McpServer({
  name: "angular-standards",
  version: "0.1.0",
});

server.tool(
  "list_standards_sections",
  "List available architecture standard sections. Call first to discover what to fetch. ~200 tokens.",
  {},
  async () => ({
    content: [
      {
        type: "text" as const,
        text: Object.entries(SECTION_SUMMARIES)
          .map(([key, summary]) => `- **${key}**: ${summary}`)
          .join("\n"),
      },
    ],
  })
);

server.tool(
  "get_standards_section",
  "Fetch ONE standards section on demand. Avoid loading all standards into context.",
  {
    section: z.enum([
      "architecture",
      "modern-angular",
      "rxjs",
      "typescript",
      "performance",
      "accessibility",
      "styling",
      "testing",
      "security",
      "governance",
      "operations",
      "review-format",
      "anti-patterns",
    ] as const),
  },
  async ({ section }) => ({
    content: [{ type: "text" as const, text: readSection(section) }],
  })
);

server.tool(
  "get_pr_review_brief",
  "Minimal PR review orchestration brief. Loads review-format + anti-patterns only (~800 tokens vs full prompt).",
  {},
  async () => ({
    content: [
      {
        type: "text" as const,
        text: [
          readSection("review-format"),
          "",
          "---",
          "",
          readSection("anti-patterns"),
        ].join("\n"),
      },
    ],
  })
);

server.tool(
  "get_review_sections_for_diff",
  "Return only the standard sections relevant to changed file types. Reduces token load during PR review.",
  {
    changedExtensions: z.array(z.string()).describe("e.g. ['.ts', '.html', '.scss']"),
  },
  async ({ changedExtensions }) => {
    const sections = new Set<StandardSection>(["review-format", "anti-patterns"]);

    if (changedExtensions.some((e) => [".ts", ".html"].includes(e))) {
      sections.add("architecture");
      sections.add("modern-angular");
      sections.add("rxjs");
      sections.add("typescript");
      sections.add("performance");
      sections.add("accessibility");
      sections.add("testing");
      sections.add("security");
    }
    if (changedExtensions.some((e) => [".scss", ".css"].includes(e))) {
      sections.add("styling");
    }
    if (changedExtensions.some((e) => e === ".ts")) {
      sections.add("governance");
      sections.add("operations");
    }

    const text = [...sections]
      .map((s) => `# ${s}\n\n${readSection(s)}`)
      .join("\n\n---\n\n");

    return { content: [{ type: "text" as const, text }] };
  }
);

server.tool(
  "scan_angular_violations",
  "Fast heuristic scan of an Angular source file. Returns violations without loading full standards.",
  {
    filePath: z.string().describe("Absolute or workspace-relative path to .ts or .html file"),
    source: z.string().describe("File contents to scan"),
  },
  async ({ filePath, source }) => {
    const violations = scanAngularSource(source, filePath);
    const text =
      violations.length === 0
        ? "No heuristic violations detected. Still run full standards review for architecture and a11y."
        : violations.map((v, i) => `${i + 1}. ${v}`).join("\n");

    return { content: [{ type: "text" as const, text }] };
  }
);

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
