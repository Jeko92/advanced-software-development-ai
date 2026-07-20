function toJadenCase(str: string): string {
  return str.split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.substring(1)).join(' ');
}
