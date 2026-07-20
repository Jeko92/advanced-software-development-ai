/*
https://www.codewars.com/kata/5e16ffb7297fe00001114824/train/javascript
You work in the best consumer electronics corporation, and your boss wants to find out which three products
generate the most revenue. Given 3 lists of the same length like these:

products: ["Computer", "Cell Phones", "Vacuum Cleaner"]
amounts: [3, 24, 8]
prices: [199, 299, 399]
return the three product names with the highest revenue (amount * price).

Note: if multiple products have the same revenue, order them according to their original positions in the input list.
*/

function top3(products: string[], amounts: number[], prices: number[]): string[] {
  const rev: number[] = products.map((v: string, i: number) => prices[i] * amounts[i]);
  const result: string[] = [];

  for (let i = 0; i < 3; i++) {
    result.push(products[rev.indexOf(Math.max(...rev))]);
    rev[rev.indexOf(Math.max(...rev))] = -1;
  }
  return result;
}
