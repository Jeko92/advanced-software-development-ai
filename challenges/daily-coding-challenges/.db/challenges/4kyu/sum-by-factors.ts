/*
https://www.codewars.com/kata/54d496788776e49e6b00052f/solutions/javascript

Given an array of positive or negative integers
I= [i1,..,in]
you have to produce a sorted array P of the form
[ [p, sum of all ij of I for which p is a prime factor (p positive) of ij] ...]
P will be sorted by increasing order of the prime numbers. The final result has to be given as a string in Java,
C#, C, C++ and as an array of arrays in other languages.
Example:
I = [12, 15]; //result = [[2, 12], [3, 27], [5, 15]]
[2, 3, 5] is the list of all prime factors of the elements of I, hence the result.
Notes:
It can happen that a sum is 0 if some numbers are negative!
Example: I = [15, 30, -45] 5 divides 15, 30 and (-45) so 5 appears in the result, the sum of the numbers for
which 5 is a factor is 0 so we have [5, 0] in the result amongst others.
*/

import { test } from "@/test.ts";

function sumOfDivided(list: number[]): [number, number][] {
  // your code here
}

test(sumOfDivided([12, 15]), [[2, 12], [3, 27], [5, 15]]);
test(sumOfDivided([15, 30, -45]), [[2, 30], [3, 0], [5, 0]]);
test(sumOfDivided([]), []);
test(sumOfDivided([7, 14, 21]), [[3, 21], [7, 42]]);
test(sumOfDivided([12, 21, 18]), [[2, 30], [3, 51], [7, 21]]);
