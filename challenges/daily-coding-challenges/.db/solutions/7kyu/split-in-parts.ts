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

function splitInParts(s: string, p: number): string {
  let res: string = s[0];
  for (let i = 1; i < s.length; i++) {
    if (i % p === 0) {
      res += " ";
    }
    res += s[i];
  }
  return res;
}
