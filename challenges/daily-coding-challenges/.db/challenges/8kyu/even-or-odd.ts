// Create a function (or write a script in Shell) that takes an integer as an argument and
// returns "Even" for even numbers or "Odd" for odd numbers.

import { test } from "@/test.ts";

function even_or_odd(n: number): string {
  // your code here
}

test(even_or_odd(2), "Even");
test(even_or_odd(7), "Odd");
test(even_or_odd(0), "Even");
test(even_or_odd(-4), "Even");
test(even_or_odd(-3), "Odd");
