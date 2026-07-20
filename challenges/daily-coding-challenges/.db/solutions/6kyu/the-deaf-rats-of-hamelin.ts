/*
The Pied Piper has been enlisted to play his magical tune and coax all the rats out of town.
But some of the rats are deaf and are going the wrong way!
Kata Task
How many deaf rats are there?
Legend
P = The Pied Piper
O~ = Rat going left
~O = Rat going right
Example
ex1 ~O~O~O~O P has 0 deaf rats
ex2 P O~ O~ ~O O~ has 1 deaf rat
ex3 ~O~O~O~OP~O~OO~ has 2 deaf rats
*/

function countDeafRats(str: string): number {
  let count: number = 0;
  if (!str.includes('P')) return 0;
  const leftOfP: string = str.slice(0, str.indexOf('P')).replace(/\s/g, '');
  const rightOfP: string = str.slice(str.indexOf('P') + 1).replace(/\s/g, '');
  for (let i = 0; i < leftOfP.length; i += 2) {
    if (leftOfP.charAt(i) !== '~') {
      count++;
    }
  }
  for (let j = 0; j < rightOfP.length; j += 2) {
    if (rightOfP.charAt(j) !== 'O') {
      count++;
    }
  }
  return count;
}
