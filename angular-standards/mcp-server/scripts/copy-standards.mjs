import { cpSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = join(__dirname, "..");

const standardsSource = join(__dirname, "../../standards");
const standardsTarget = join(pkgRoot, "standards");
const templatesSource = join(__dirname, "../../templates");
const templatesTarget = join(pkgRoot, "templates");

if (!existsSync(standardsSource)) {
  console.error("Source standards directory missing:", standardsSource);
  process.exit(1);
}

mkdirSync(standardsTarget, { recursive: true });
cpSync(standardsSource, standardsTarget, { recursive: true });
console.log("Copied standards to mcp-server/standards");

if (existsSync(templatesSource)) {
  mkdirSync(templatesTarget, { recursive: true });
  cpSync(templatesSource, templatesTarget, { recursive: true });
  console.log("Copied templates to mcp-server/templates");
}
