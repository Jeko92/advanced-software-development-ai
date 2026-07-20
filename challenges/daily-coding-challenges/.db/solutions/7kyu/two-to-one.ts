function longest(s1: string, s2: string): string {
  return [...new Set(s1.split("").concat(s2.split("")).sort())].join("");
}
