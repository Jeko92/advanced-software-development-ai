// Write a function that returns both the minimum and maximum number of the given list/array.

function minMax(a: number[]): [number, number] {
  return [Math.min.apply(0, a), Math.max.apply(0, a)];
}
