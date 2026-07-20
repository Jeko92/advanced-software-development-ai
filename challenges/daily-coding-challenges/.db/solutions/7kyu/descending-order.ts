function descendingOrder(n: number): number {
  return parseInt(String(n).split('').sort().reverse().join(''));
}
