function getSize(w: number, h: number, d: number): number[] {
    return [2 * (w * h) + 2 * (w * d) + 2 * (h * d), w * h * d];
}
