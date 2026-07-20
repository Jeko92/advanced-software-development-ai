// Write a function that takes an array and counts the number of each unique element present.
// count(['james', 'james', 'john'])
// #=> { 'james': 2, 'john': 1}

function count(a: string[]): Record<string, number> {
  const res: Record<string, number> = {};
  const differentEntries = new Set(a);
  for (const entry of differentEntries) {
    res[entry] = a.filter((el: string) => el === entry).length;
  }
  return res;
}
