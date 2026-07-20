// Your task is to remove all duplicate words from a string, leaving only single (first) words entries.

function removeDuplicateWords(s: string): string {
  return [...new Set(s.split(" "))].join(" ");
}
