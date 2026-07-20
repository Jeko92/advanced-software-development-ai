// Complete the method/function so that it converts dash/underscore delimited words into camel casing.
// The first word within the output should be capitalized only if the original word was capitalized
// (known as Upper Camel Case, also often referred to as Pascal case).
// Examples
// toCamelCase("the-stealth-warrior") // returns "theStealthWarrior"
// toCamelCase("The_Stealth_Warrior") // returns "TheStealthWarrior"

import { test } from "@/test.ts";

function toCamelCase(str: string): string {
  // your code here
}

test(toCamelCase("the-stealth-warrior"), "theStealthWarrior");
test(toCamelCase("The_Stealth_Warrior"), "TheStealthWarrior");
test(toCamelCase(""), "");
test(toCamelCase("hello-world"), "helloWorld");
test(toCamelCase("foo_bar_baz"), "fooBarBaz");
