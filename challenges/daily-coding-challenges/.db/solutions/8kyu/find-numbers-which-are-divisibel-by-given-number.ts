function divisibleBy(numbers: number[], divisor: number): number[] {
    return numbers.filter(x => x % divisor == 0);
}
