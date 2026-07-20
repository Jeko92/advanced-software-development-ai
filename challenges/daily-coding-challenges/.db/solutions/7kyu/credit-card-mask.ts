/*
https://www.codewars.com/kata/5412509bd436bd33920011bc/train/javascript
Usually when you buy something, you're asked whether your credit card number, phone number or answer to your
most secret question is still correct. However, since someone could look over your shoulder, you don't want that
shown on your screen. Instead, we mask it.
Your task is to write a function maskify, which changes all but the last four characters into '#'.
*/

function maskify(s: string): string {
  return s.length < 5 ? s : '#'.repeat(s.length - 4) + s.substring(s.length - 4);
}
