import { test } from "@/test.ts";

function DNAStrand(dna: string): string {
  // your code here
}

test(DNAStrand("ATTGC"), "TAACG");
test(DNAStrand("GTAT"), "CATA");
test(DNAStrand("AAAA"), "TTTT");
test(DNAStrand("CCGG"), "GGCC");
test(DNAStrand("ATCG"), "TAGC");
