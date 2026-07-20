// The main idea is to count all the occuring characters(UTF-8) in string. If you have string like this aba then
// the result should be { 'a': 2, 'b': 1 }. What if the string is empty ? Then the result should be empty object literal { }

function count(s: string): Record<string, number> {
  return s.split('').reduce((a: Record<string, number>, v: string) => {
    a[v] = (a[v] || 0) + 1;
    return a;
  }, {});
}
