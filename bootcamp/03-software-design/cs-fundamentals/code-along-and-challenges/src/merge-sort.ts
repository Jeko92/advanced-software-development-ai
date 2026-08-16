export class MergeSort {
  sort(arr: number[]): number[] {
    if (arr.length <= 1) {
      return arr;
    }

    const mid = Math.floor(arr.length / 2);

    const left = this.sort(arr.slice(0, mid));
    const right = this.sort(arr.slice(mid));

    return this.merge(left, right);
  }

  private merge(left: number[], right: number[]): number[] {
    const result: number[] = [];

    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
      const leftValue = left[leftIndex];
      const rightValue = right[rightIndex];

      if (leftValue === undefined || rightValue === undefined) {
        break;
      }

      if (leftValue <= rightValue) {
        result.push(leftValue);
        leftIndex++;
      } else {
        result.push(rightValue);
        rightIndex++;
      }
    }

    while (leftIndex < left.length) {
      const leftValue = left[leftIndex];

      if (leftValue !== undefined) {
        result.push(leftValue);
      }

      leftIndex++;
    }

    while (rightIndex < right.length) {
      const rightValue = right[rightIndex];

      if (rightValue !== undefined) {
        result.push(rightValue);
      }

      rightIndex++;
    }

    return result;
  }
}
