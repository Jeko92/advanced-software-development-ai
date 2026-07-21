function greet(name: string): string {
  return `Hello, ${name}!`;
}

function logMessage(message: string): void {
  console.log(message);
}

function add(a: string, b: string): string {
  return a + b;
}

console.log(greet("Sam"));
logMessage("Welcome to TypeScript");
console.log(add("5", "7"));
