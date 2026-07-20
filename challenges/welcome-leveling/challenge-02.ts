function maskify(s: string): string {
  return s.length <= 4 ? s : "#".repeat(s.length - 4) + s.slice(-4);
}

console.log(maskify("Skippy"));
console.log(maskify("Nananananananananananananananana Batman!"));
console.log(maskify("4556364607935616"));
console.log(maskify("1"));
console.log(maskify(""));
