export class InsertionSort {
  sort(arr: number[]): number[] {
    for (let i = 1; i < arr.length; i++) {
      // Use ! to tell TypeScript these index locations are guaranteed to be defined
      const current = arr[i]!;
      let j = i - 1;

      while (j >= 0 && arr[j]! > current) {
        arr[j + 1] = arr[j]!;
        j--;
      }

      arr[j + 1] = current;
    }

    return arr;
  }
}
