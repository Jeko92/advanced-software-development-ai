/*
https://www.codewars.com/kata/5650ab06d11d675371000003/train/javascript
The aim of this kata is to split a given string into different strings of equal size (note size of strings is
passed to the method)

Example:

Split the below string into other strings of size #3

'supercalifragilisticexpialidocious'

Will return a new string
'sup erc ali fra gil ist ice xpi ali doc iou s'
*/

import { test } from "@/test.ts";

function splitInParts(s: string, p: number): string {
  // your code here
}

test(splitInParts("supercalifragilisticexpialidocious", 3), "sup erc ali fra gil ist ice xpi ali doc iou s");
test(splitInParts("hello", 2), "he ll o");
test(splitInParts("abcdef", 2), "ab cd ef");
test(splitInParts("abcdef", 3), "abc def");
test(splitInParts("a", 5), "a");
