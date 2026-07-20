function yourOrderPlease(s: string): string {
  return s === ""
    ? ""
    : s
        .split(" ")
        .sort((a, b) => Number(/\d/.exec(a)) - Number(/\d/.exec(b)))
        .join(" ");
}

console.log(yourOrderPlease("is2 Thi1s T4est 3a"));
console.log(yourOrderPlease("4of Fo1r pe6ople g3ood th5e the2"));
console.log(yourOrderPlease(""));
