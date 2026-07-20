// Complete the solution so that it returns true if the first argument(string)
// passed in ends with the 2nd argument (also a string).

function solution(str: string, ending: string): boolean {
  return str.substring(str.length - ending.length) === ending;
}
