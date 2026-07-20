function squareDigits(num: number): number {
  return parseInt(
    String(num)
      .split("")
      .map((n) => (parseInt(n) ** 2).toString())
      .join("")
  );
}
