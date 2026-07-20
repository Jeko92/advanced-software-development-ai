function duplicates(array: number[]): number {
  const double: (number | undefined)[] = [];
  let count: number = 0;
  array.forEach((el: number) => {
    if (double[el] !== el) {
      double[el] = el;
    } else {
      double[el] = undefined;
      count++;
    }
  });

  return count;
}
