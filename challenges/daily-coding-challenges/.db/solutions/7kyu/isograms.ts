function isIsogram(s: string): boolean {
  const ar: string[] = s.split('').map((el: string) => el.toLowerCase()).sort();
  for (let i = 0; i < ar.length; i++) {
    if (ar[i] === ar[i + 1]) {
      return false;
    }
  }
  return true;
}
