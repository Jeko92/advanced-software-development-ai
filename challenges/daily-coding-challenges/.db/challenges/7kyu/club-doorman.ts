// The Club Doorman will give you a word. To enter the Club you need to provide the right number according
// to provided the word.
// Every given word has a doubled letter, like 'tt' in lettuce.
// To answer the right number you need to find the doubled letter's position of the given word in the
// alphabet and multiply this number per 3.

import { test } from "@/test.ts";

function passTheDoorMan(s: string): number | undefined {
  // your code here
}

test(passTheDoorMan("lettuce"), 60);
test(passTheDoorMan("account"), 9);
test(passTheDoorMan("balloon"), 36);
test(passTheDoorMan("coffee"), 18);
test(passTheDoorMan("door"), 45);
