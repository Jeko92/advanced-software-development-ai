interface Names {
  name: string;
}

function whoLikesIt(names: Names[]): string {
  const [first, second, third] = names;

  if (first === undefined) {
    return "no one likes this";
  }

  if (second === undefined) {
    return `${first.name} likes this`;
  }

  if (third === undefined) {
    return `${first.name} and ${second.name} like this`;
  }

  if (names.length === 3) {
    return `${first.name}, ${second.name} and ${third.name} like this`;
  }

  return `${first.name}, ${second.name} and ${String(names.length - 2)} others like this`;
}

console.log(whoLikesIt([]));

console.log(whoLikesIt([{ name: "Peter" }]));

console.log(whoLikesIt([{ name: "Jacob" }, { name: "Alex" }]));

console.log(whoLikesIt([{ name: "Max" }, { name: "John" }, { name: "Mark" }]));

console.log(
  whoLikesIt([
    { name: "Alex" },
    { name: "Jacob" },
    { name: "Mark" },
    { name: "Max" },
  ]),
);
