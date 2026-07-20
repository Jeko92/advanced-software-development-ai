/*
https://www.codewars.com/kata/535474308bb336c9980006f2/train/javascript
Write a method that takes one argument as name and then greets that name, capitalized and ends with an exclamation point.

Example:

"riley" --> "Hello Riley!"
"JACK"  --> "Hello Jack!"
*/

import { test } from "@/test.ts";

function greet(s: string): string {
  // your code here
}

test(greet("riley"), "Hello Riley!");
test(greet("JACK"), "Hello Jack!");
test(greet("aVA"), "Hello Ava!");
test(greet("hello"), "Hello Hello!");
test(greet("world"), "Hello World!");
