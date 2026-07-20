// /3/
// \7\ 4
// 2 \4\ 6
// 8 5 \9\ 3
// Your task is to write a function longestSlideDown that takes a pyramid representation as argument and returns its
// ' longest 'slide down'. Let's say that the 'slide down' is a sum of consecutive numbers from the top to the bottom
// of the pyramid. As you can see, the longest 'slide down' is 3 + 7 + 4 + 9 = 23

function longestSlideDown(a: number[][]): number {
    for (let i = a.length - 1; i >= 0; i--) {
      for (let k = 0; k < a[i].length - 1; k++) {
        a[i - 1][k] += Math.max(a[i][k], a[i][k + 1]);
      }
    }
    return a[0][0];
}
