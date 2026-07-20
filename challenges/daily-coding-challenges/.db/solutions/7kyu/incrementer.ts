// Given an input of an array of digits num, return the array with each digit incremented by its position
// in the array. For example, the first digit will be incremented by 1, the second digit by 2 etc. Make
// sure to start counting your positions from 1 and not 0.
// incrementer([1,2,3]) => [2,4,6]
// Your result can only contain single digit numbers, so if adding a digit with it's position gives you a
// multiple-digit number, only the last digit of the number should be returned

function incrementer(a: number[]): number[] {
  return a.map((x: number, index: number) => (x + index + 1) % 10);
}
