import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Resolve standards directory across npm install, monorepo dev, and explicit override. */
export function resolveStandardsDir(): string {
  const fromEnv = process.env.ANGULAR_STANDARDS_ROOT;
  if (fromEnv && existsSync(fromEnv)) {
    return resolve(fromEnv);
  }

  const candidates = [
    resolve(__dirname, "../standards"),
    resolve(__dirname, "../../standards"),
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error(
    "Angular standards directory not found. Set ANGULAR_STANDARDS_ROOT or reinstall angular-standards-mcp."
  );
}

export function resolveMcpServerEntry(): string {
  return join(__dirname, "index.js");
}
