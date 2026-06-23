import { cpSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const source = join(__dirname, "../../standards");
const target = join(__dirname, "../standards");

if (!existsSync(source)) {
  console.error("Source standards directory missing:", source);
  process.exit(1);
}

mkdirSync(target, { recursive: true });
cpSync(source, target, { recursive: true });
console.log("Copied standards to mcp-server/standards");
