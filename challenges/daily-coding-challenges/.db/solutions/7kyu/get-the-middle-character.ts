function getMiddle(str: string): string {
  return str.length % 2 === 0
    ? str.slice(str.length / 2 - 1, str.length / 2 + 1)
    : str.charAt(Math.floor(str.length / 2));
}
