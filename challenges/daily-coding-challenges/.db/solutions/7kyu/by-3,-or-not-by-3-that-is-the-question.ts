function divisibleByThree(str: string): boolean {
  return str.split('').map(Number).reduce((a: number, b: number) => a + b) % 3 === 0;
}
