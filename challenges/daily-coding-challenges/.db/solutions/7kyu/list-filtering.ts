/*
https://www.codewars.com/kata/list-filtering
In this kata you will create a function that takes a list of non-negative integers and
strings and returns a new list with the strings filtered out.
*/

function filter_list(ar: (string | number)[]): number[] {
  return ar.filter((el): el is number => typeof el === 'number');
}
