// The Club Doorman will give you a word. To enter the Club you need to provide the right number according
// to provided the word.
// Every given word has a doubled letter, like 'tt' in lettuce.
// To answer the right number you need to find the doubled letter's position of the given word in the
// alphabet and multiply this number per 3.

function passTheDoorMan(s: string): number | undefined {
  const abc: Record<string, number> = {
    a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 10,
    k: 11, l: 12, m: 13, n: 14, o: 15, p: 16, q: 17, r: 18, s: 19,
    t: 20, u: 21, v: 22, w: 23, x: 24, y: 25, z: 26
  };

  for (let i = 0; i < s.length; i++) {
    if (s[i] === s[i + 1]) {
      return 3 * abc[s[i]];
    }
  }
}
