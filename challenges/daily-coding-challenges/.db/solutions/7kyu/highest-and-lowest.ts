function highAndLow(str: string): string {
  const ar: number[] = str.split(' ').map((el: string) => parseInt(el));
  return `${Math.max.apply(Array, ar)} ${Math.min.apply(Array, ar)}`;
}
