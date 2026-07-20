function betterThanAverage(all: number[], own: number): boolean {
    return own > all.reduce((a, b) => a + b, 0) / all.length;
}
