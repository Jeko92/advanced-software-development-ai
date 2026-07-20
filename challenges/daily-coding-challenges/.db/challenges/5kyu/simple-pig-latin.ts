// Move the first letter of each word to the end of it, then add "ay" to the end of the word. Leave punctuation marks untouched.
// Examples
// pigIt('Pig latin is cool'); => igPay atinlay siay oolcay
// pigIt('Hello world !'); =>  elloHay orldway !

import { test } from "@/test.ts";

function pigIt(s: string): string {
    // your code here
}

test(pigIt("Pig latin is cool"), "igPay atinlay siay oolcay");
test(pigIt("Hello world !"), "elloHay orldway !");
test(pigIt("This is my test"), "hisTay siay ymay esttay");
test(pigIt("!"), "!");
test(pigIt("A"), "Aay");
