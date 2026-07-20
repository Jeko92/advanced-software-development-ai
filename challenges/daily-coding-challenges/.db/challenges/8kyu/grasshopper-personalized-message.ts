// Create a function that gives a personalized greeting. This function takes two parameters: name and owner.

import { test } from "@/test.ts";

function greet(name: string, owner: string): string {
  // your code here
}

test(greet("Daniel", "Daniel"), "Hello boss");
test(greet("Greg", "Daniel"), "Hello guest");
test(greet("Alice", "Alice"), "Hello boss");
test(greet("Bob", "Alice"), "Hello guest");
test(greet("", ""), "Hello boss");
