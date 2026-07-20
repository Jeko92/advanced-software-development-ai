// https://www.codewars.com/kata/52efefcbcdf57161d4000091/train/javascript

function count(s: string): Record<string, number> {
  return s.split('').reduce((obj: Record<string, number>, v: string) => {
    obj[v] = (obj[v] || 0) + 1;
    return obj;
  }, {});
}
