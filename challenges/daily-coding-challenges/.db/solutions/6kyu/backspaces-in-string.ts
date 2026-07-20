/*
https://www.codewars.com/kata/backspaces-in-string/train/javascript
Assume "#" is like a backspace in string. This means that string "a#bc#d" actually is "bd"
Your task is to process a string with "#" symbols.
Examples
"abc#d##c"      ==>  "ac"
"abc##d######"  ==>  ""
"#######"       ==>  ""
""              ==>  ""
*/

function cleanString(string: string): string {
  let cleaned: string[] = [];
  string.split('').forEach(char => {
    if (char === '#') {
      cleaned.pop();
    } else {
      cleaned.push(char);
    }
  });
  return cleaned.join('');
}
