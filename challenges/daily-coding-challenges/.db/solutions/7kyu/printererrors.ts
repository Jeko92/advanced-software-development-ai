function printerError(s: string): string {
  return `${s.match(/[n-z]/gi) ? s.match(/[n-z]/gi)!.length : 0}/${s.length}`;
}
