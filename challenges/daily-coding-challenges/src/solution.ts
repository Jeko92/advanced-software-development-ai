import { readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const SOLUTIONS_DIR = ".db/solutions";
const KYU_LEVELS = ["4kyu", "5kyu", "6kyu", "7kyu", "8kyu"];

const arg = process.argv[2];

if (!arg) {
  console.error("Usage: solution <challenge-name>");
  console.error("  e.g. solution find-the-parity-outlier");
  process.exit(1);
}

// Strip leading date prefix (YYYY-MM-DD-) to get the challenge name
const name = arg;
const challengeDir = "challenges";

let found: { kyu: string; path: string } | null = null;

for (const kyu of KYU_LEVELS) {
  const dir = join(SOLUTIONS_DIR, kyu);
  const files = await readdir(dir);
  if (files.includes(`${name}.ts`)) {
    found = { kyu, path: join(dir, `${name}.ts`) };
    break;
  }
}

if (!found) {
  console.error(`No solution found for "${name}"`);
  process.exit(1);
}

const content = await readFile(found.path, "utf8");
const destPath = join(challengeDir, `${name}.solution.ts`);

await writeFile(destPath, content, "utf8");

console.log(`[${found.kyu}] Solution written to ${destPath}`);
