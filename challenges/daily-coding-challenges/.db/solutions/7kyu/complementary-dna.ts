function DNAStrand(dna: string): string {
  const dnaPairs: Record<string, string> = { A: 'T', T: 'A', C: 'G', G: 'C' };
  return dna.split('').map((c: string) => dnaPairs[c]).join('');
}
