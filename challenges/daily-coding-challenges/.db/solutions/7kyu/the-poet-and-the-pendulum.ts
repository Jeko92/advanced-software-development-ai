// Given an array/list [] of n integers , Arrange them in a way similar to the to-and-fro movement of a Pendulum
// The Smallest element of the list of integers , must come in center position of array/list.
// pendulum ([6, 6, 8 ,5 ,10]) ==> [10, 6, 5, 6, 8]

function pendulum(a: number[]): number[] {
  let ar: number[] = [];
  let sorted: number[] = a.sort((a, b) => a - b);
  ar.push(sorted.splice(0, 1)[0]);
  sorted.forEach((n, i) => {
    if (i % 2 == 0 || i == 0) {
      ar.push(n);
    } else {
      ar.unshift(n);
    }
  });
  return ar;
}
