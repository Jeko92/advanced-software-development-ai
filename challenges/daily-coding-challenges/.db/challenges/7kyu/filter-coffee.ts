/*
https://www.codewars.com/kata/56069d0c4af7f633910000d3
You love coffee and want to know what beans you can afford to buy it.
The first argument to your search function will be a number which represents your budget.
The second argument will be an array of coffee bean prices.
Your 'search' function should return the stores that sell coffee within your budget.
The search function should return a string of prices for the coffees beans you can afford.
The prices in this string are to be sorted in ascending order.
*/

import { test } from "@/test.ts";

function search(budget: number, prices: number[]): string {
  // your code here
}

test(search(10, [5, 8, 12, 3]), "3,5,8");
test(search(5, [1, 2, 3, 4, 5]), "1,2,3,4,5");
test(search(1, [2, 3, 4]), "");
test(search(100, [50, 25, 75, 10]), "10,25,50,75");
test(search(7, [7, 8, 6]), "6,7");
