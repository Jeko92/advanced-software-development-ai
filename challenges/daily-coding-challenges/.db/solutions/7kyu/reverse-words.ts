// https://www.codewars.com/kata/5259b20d6021e9e14c0010d4/train/javascript

function reverseWords(str: string): string {
  return str
    .split(" ")
    .map((el) => el.split("").reverse().join(""))
    .join(" ");
}
