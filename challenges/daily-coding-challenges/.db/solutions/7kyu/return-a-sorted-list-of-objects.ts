// You'll be passed an array of objects (list) - you must sort them in descending order
// based on the value of the specified property (sortBy).

function sortList(sortBy: string, list: Record<string, number>[]): Record<string, number>[] {
  return list.sort((a, b) => b[sortBy] - a[sortBy]);
}
