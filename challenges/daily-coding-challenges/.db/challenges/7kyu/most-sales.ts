/*
https://www.codewars.com/kata/5e16ffb7297fe00001114824/train/javascript
You work in the best consumer electronics corporation, and your boss wants to find out which three products
generate the most revenue. Given 3 lists of the same length like these:

products: ["Computer", "Cell Phones", "Vacuum Cleaner"]
amounts: [3, 24, 8]
prices: [199, 299, 399]
return the three product names with the highest revenue (amount * price).

Note: if multiple products have the same revenue, order them according to their original positions in the input list.
*/

import { test } from "@/test.ts";

function top3(products: string[], amounts: number[], prices: number[]): string[] {
  // your code here
}

test(top3(["Computer", "Cell Phones", "Vacuum Cleaner"], [3, 24, 8], [199, 299, 399]), ["Cell Phones", "Vacuum Cleaner", "Computer"]);
test(top3(["A", "B", "C", "D"], [1, 2, 3, 4], [10, 20, 30, 40]), ["D", "C", "B"]);
test(top3(["X", "Y", "Z"], [5, 5, 5], [10, 20, 30]), ["Z", "Y", "X"]);
test(top3(["P", "Q", "R"], [10, 1, 1], [1, 100, 50]), ["Q", "P", "R"]);
test(top3(["Alpha", "Beta", "Gamma"], [2, 3, 1], [50, 50, 50]), ["Beta", "Alpha", "Gamma"]);
