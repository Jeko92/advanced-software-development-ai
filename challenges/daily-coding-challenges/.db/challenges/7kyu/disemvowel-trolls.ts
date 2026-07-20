import { test } from "@/test.ts";

function disemvowel(s: string): string {
  // your code here
}

test(disemvowel("This website is for losers LOL!"), "Ths wbst s fr lsrs LL!");
test(disemvowel("hello"), "hll");
test(disemvowel("aeiouAEIOU"), "");
test(disemvowel("bcdfg"), "bcdfg");
test(disemvowel("No offense"), "N ffns");
