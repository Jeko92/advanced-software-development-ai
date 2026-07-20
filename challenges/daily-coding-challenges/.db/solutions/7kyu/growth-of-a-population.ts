function nbYear(p0: number, percent: number, aug: number, p: number): number {
  let pop: number = p0;
  let years: number = 0;
  while (pop < p) {
    pop = pop + pop * percent / 100 + aug;
    years++;
  }
  return years;
}
