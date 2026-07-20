// Create a function that takes a 2D array as an input, and outputs another array that contains
// the average values for the numbers in the nested arrays at the corresponding indexes.

function avgArray(ar: number[][]): number[] {
  const res: number[] = [];
  let avg: number;
  for (let i = 0; i < ar[0].length; i++) {
    avg = 0;
    for (let j = 0; j < ar.length; j++) {
      avg += ar[j][i];
    }
    avg /= ar.length;
    res.push(avg);
  }
  return res;
}
