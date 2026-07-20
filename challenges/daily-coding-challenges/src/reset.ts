import { writeFileSync } from "node:fs";

const DEFAULT = {
  "4kyu": [],
  "5kyu": [],
  "6kyu": [],
  "7kyu": [],
  "8kyu": [],
};

await writeFileSync(".db/cache.json", JSON.stringify(DEFAULT, null, 2));
