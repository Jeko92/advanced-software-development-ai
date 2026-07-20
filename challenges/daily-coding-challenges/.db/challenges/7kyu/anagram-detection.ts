/*
An anagram is the result of rearranging the letters of a word to produce a new word.
Note: anagrams are case insensitive
Complete the function to return true if the two arguments given are anagrams of each other;
return false otherwise.
*/

import { test } from "@/test.ts";

function isAnagram(test: string, original: string): boolean {
  // your code here
}

test(isAnagram("abc", "cba"), true);
test(isAnagram("listen", "silent"), true);
test(isAnagram("hello", "world"), false);
test(isAnagram("Astronomer", "Moon starer"), false);
test(isAnagram("abc", "abc"), true);
