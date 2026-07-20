function stairsIn20(s: number[][]): number {
    return s.reduce((a, v) => a += v.reduce((a, v) => a + v, 0), 0) * 20;
}
