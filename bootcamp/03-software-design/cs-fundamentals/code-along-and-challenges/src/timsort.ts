import { InsertionSort } from './insertion-sort.ts';
import { MergeSort } from './merge-sort.ts';

export class TimSort {
  private readonly runSize: number;
  private readonly insertionSorter = new InsertionSort();
  private readonly mergeSort = new MergeSort();

  constructor(runSize = 32) {
    this.runSize = runSize;
  }

  sort(arr: number[]): number[] {
    if (arr.length <= 1) {
      return arr;
    }

    let runs: number[][] = [];

    for (let start = 0; start < arr.length; start += this.runSize) {
      const run = arr.slice(start, start + this.runSize);
      this.insertionSorter.sort(run);
      console.log(`Sorted run: [${run}]`);
      runs.push(run);
    }

    while (runs.length > 1) {
      const mergedRuns: number[][] = [];

      for (let i = 0; i < runs.length; i += 2) {
        const left = runs[i]!;
        const right = runs[i + 1];

        if (!right) {
          mergedRuns.push(left);
          continue;
        }

        const merged = this.mergeSort.merge(left, right);
        console.log(`Merging [${left}] and [${right}] → [${merged}]`);
        mergedRuns.push(merged);
      }

      runs = mergedRuns;
    }

    return runs[0] ?? [];
  }
}
