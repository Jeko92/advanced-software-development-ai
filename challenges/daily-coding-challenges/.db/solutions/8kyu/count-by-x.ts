function countBy(x: number, n: number): number[] {
    return [...Array(n + 1).keys()].map(el => el * x).slice(1);
}
