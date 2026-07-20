function getCount(str: string): number {
  let vowelCount: number = 0;
  const vowels: string[] = ["a", "e", "i", "o", "u"];
  str.split("").map((item) => {
    if (vowels.includes(item)) {
      vowelCount++;
    }
  });
  return vowelCount;
}
