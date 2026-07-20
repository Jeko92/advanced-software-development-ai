/*
https://www.codewars.com/kata/558fa34727c2d274c10000ae/solutions/javascript
Write a program that, given a word, computes the scrabble score for that word.
Letter Values
You'll need these:
Letter                           Value
A, E, I, O, U, L, N, R, S, T       1
D, G                               2
B, C, M, P                         3
F, H, V, W, Y                      4
K                                  5
J, X                               8
Q, Z                               10
There will be a preloaded hashtable $dict with all these values: $dict["E"] == 1.
*/

const $dict: Record<string, number> = {
  E: 1,
  A: 1,
  I: 1,
  O: 1,
  N: 1,
  R: 1,
  T: 1,
  L: 1,
  S: 1,
  U: 1,
  D: 2,
  G: 2,
  B: 3,
  C: 3,
  M: 3,
  P: 3,
  F: 4,
  H: 4,
  V: 4,
  W: 4,
  Y: 4,
  K: 5,
  J: 8,
  X: 8,
  Q: 10,
  Z: 10,
};

function scrabbleScore(str: string): number {
  let res: number = 0;
  for (let i = 0; i < str.length; i++) {
    if ($dict[str[i].toUpperCase()]) {
      res += $dict[str[i].toUpperCase()];
    }
  }
  return res;
}
