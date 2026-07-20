/*
Your task is to sort a given string. Each word in the string will contain a single number. This number is the position the
word should have in the result.
Note: Numbers can be from 1 to 9. So 1 will be the first word (not 0).
*/

function order(s: string): string {
  return s.split(' ').sort((a, b) => {
    if (+(a.match(/\d+/)![0]) < +(b.match(/\d+/)![0]))
      return -1;
    else if (+(a.match(/\d+/)![0]) > +(b.match(/\d+/)![0]))
      return 1;
    else
      return 0;
  }).join(' ');
}
