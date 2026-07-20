/*
A palindrome is a word, phrase, number, or other sequence of characters which reads the same backward
or forward. This includes capital letters, punctuation, and word dividers.
Implement a function that checks if something is a palindrome.
*/

import { test } from "@/test.ts";

function isPalindrome(line: string): boolean {
  // your code here
}

test(isPalindrome("racecar"), true);
test(isPalindrome("hello"), false);
test(isPalindrome("a"), true);
test(isPalindrome(""), true);
test(isPalindrome("madam"), true);
