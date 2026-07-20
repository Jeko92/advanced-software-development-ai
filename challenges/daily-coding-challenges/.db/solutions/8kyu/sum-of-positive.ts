function positiveSum(arr: number[]): number {
    return arr.reduce((a, b) => a + (b > 0 ? b : 0), 0);
}
