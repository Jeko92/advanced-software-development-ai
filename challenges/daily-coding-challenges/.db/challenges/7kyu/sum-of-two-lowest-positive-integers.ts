import { test } from "@/test.ts";

function sumTwoSmallestNumbers(numbers: number[]): number {
  // your code here
}

test(sumTwoSmallestNumbers([5, 8, 12, 18, 22]), 13);
test(sumTwoSmallestNumbers([7, 15, 12, 18, 22]), 19);
test(sumTwoSmallestNumbers([1, 2, 3, 4]), 3);
test(sumTwoSmallestNumbers([10, 343445353, 3453445, 3453545353453]), 3453455);
test(sumTwoSmallestNumbers([1, 1]), 2);
