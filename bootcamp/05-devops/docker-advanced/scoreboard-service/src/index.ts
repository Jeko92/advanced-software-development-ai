try {
  process.loadEnvFile();
} catch {
  // No .env file — expected in production, where env vars come from the
  // container/orchestrator directly instead of a file.
}

const requiredEnvVars = [
  'DB_USER',
  'DB_PASSWORD',
  'DB_HOST',
  'DB_PORT',
  'DB_NAME',
] as const;

for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const { DB_USER, DB_HOST, DB_PORT, DB_NAME } = process.env;

console.log('Arcade scoreboard online: player queue synced.');
console.log(
  `Database target: postgresql://${DB_USER}:***@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
);

setInterval(() => {
  console.log('Heartbeat: scoreboard service still running.');
}, 30000);
