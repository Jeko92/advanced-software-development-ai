import { readFile, writeFile, readdir } from "node:fs/promises";
import _cache from "../.db/cache.json" with { type: "json" };
const cache = _cache as Record<Kyu, string[]>;

import path from "node:path";
import { mkdirSync, readdirSync } from "node:fs";

const CHALLENGES_DIR = ".db/challenges";
const OUTPUT_DIR = "challenges";

try {
  await readdirSync(OUTPUT_DIR);
} catch {
  await mkdirSync(OUTPUT_DIR);
}

type Kyu = "4kyu" | "5kyu" | "6kyu" | "7kyu" | "8kyu";

const DIFFICULTY_MAP: Record<string, Kyu[]> = {
  default: ["6kyu", "7kyu"],
  easy: ["8kyu"],
  hard: ["4kyu", "5kyu"],
  "4": ["4kyu"],
  "5": ["5kyu"],
  "6": ["6kyu"],
  "7": ["7kyu"],
  "8": ["8kyu"],
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

async function main() {
  const arg = process.argv[2];

  const kyuFolders = DIFFICULTY_MAP[arg ?? "default"];

  if (!kyuFolders) {
    console.error(`Unknown argument: "${arg}". Use easy, hard, or 4–8.`);
    process.exit(1);
  }

  const kyu = pickRandom(kyuFolders);
  const kyuDir = path.join(CHALLENGES_DIR, kyu);

  const picked = cache[kyu];

  const allFiles = (await readdir(kyuDir)).filter((file) =>
    file.endsWith(".ts"),
  );
  const files = allFiles.filter(
    (file) => !picked.includes(path.basename(file, ".ts")),
  );

  if (files.length === 0) {
    console.log(`No challenges left in ${kyu}.`);
    process.exit(0);
  }

  const chosen = pickRandom(files);
  const srcPath = path.join(kyuDir, chosen);
  const content = await readFile(srcPath, "utf8");

  const today = new Date().toISOString().slice(0, 10);
  const destPath = path.join(OUTPUT_DIR, `${today}-${chosen}`);

  await writeFile(destPath, content, "utf8");

  const name = path.basename(chosen, ".ts");
  cache[kyu] = [...picked, name];
  await writeFile(".db/cache.json", JSON.stringify(cache, null, 2), "utf8");

  console.log(`Selected ${kyu} challenge: ${name}`);
  console.log(`→ ${destPath}`);
}

main();
