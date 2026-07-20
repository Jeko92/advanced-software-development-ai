// Complete the solution so that the function will break up camel casing, using a space between words.
// Example:
// solution('camelCasing') // => should return 'camel Casing'

import { test } from "@/test.ts";

function solution(s: string): string {
  // your code here
}

test(solution("camelCasing"), "camel Casing");
test(solution("identifier"), "identifier");
test(solution("camelCasingTest"), "camel Casing Test");
test(solution(""), "");
test(solution("helloWorld"), "hello World");
