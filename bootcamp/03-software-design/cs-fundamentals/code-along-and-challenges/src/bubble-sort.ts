export type Comparator<T> = (a: T, b: T) => number;

export class BubbleSorter<T> {
  private comparator: Comparator<T>;

  constructor(comparator?: Comparator<T>) {
    this.comparator =
      comparator ??
      ((a, b) => {
        if (a > b) return 1;
        if (a < b) return -1;
        return 0;
      });
  }

  public swap(arr: T[], indexOne: number, indexTwo: number): void {
    const temp = arr[indexTwo]!;
    arr[indexTwo] = arr[indexOne]!;
    arr[indexOne] = temp;
  }

  public sort(input: T[]): T[] {
    let swapping = true;
    let swapCount = 0;

    while (swapping) {
      swapping = false;
      for (let i = 0; i < input.length - 1; i++) {
        // Use ! to tell TypeScript these index locations are guaranteed to be defined
        const current = input[i]!;
        const next = input[i + 1]!;

        if (this.comparator(current, next) > 0) {
          console.log(`Swapping pair ${current}, ${next} in [${input}]`);
          this.swap(input, i, i + 1);
          swapCount++;
          swapping = true;
        }
      }
    }
    console.log(`Swapped ${swapCount} times`);
    return input;
  }
}
