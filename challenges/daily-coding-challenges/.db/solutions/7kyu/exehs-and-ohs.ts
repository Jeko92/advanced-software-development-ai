function XO(s: string): boolean {
  let x: number = 0;
  let o: number = 0;
  s.split('').forEach((c: string) => {
    if (c.toLowerCase() === 'o') {
      x++;
    } else if (c.toLowerCase() === 'x') {
      o++;
    }
  });
  return x === o;
}
