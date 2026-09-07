const challenge = process.argv[2];

async function main(): Promise<void> {
  await import(`./challenge-${challenge}.ts`);
}

void main();
