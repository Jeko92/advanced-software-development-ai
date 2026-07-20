/*
Given two arrays a and b write a function comp(a, b) (compSame(a, b) in Clojure) that checks whether the two arrays have the "same"
elements, with the same multiplicities. "Same" means, here, that the elements in b are the elements in a squared, regardless of the order.
Examples
Valid arrays
a = [121, 144, 19, 161, 19, 144, 19, 11]
b = [121, 14641, 20736, 361, 25921, 361, 20736, 361]
*/

function comp(a1: number[] | null, a2: number[] | null): boolean {
  if (!a1 || !a2) return false;
  return JSON.stringify(a1.map(x => x ** 2).sort()) === JSON.stringify(a2.sort());
}
