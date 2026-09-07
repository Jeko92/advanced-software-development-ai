const challenge = process.argv[2];

await import(`./challenge-${challenge}.ts`);
