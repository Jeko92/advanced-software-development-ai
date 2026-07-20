/*
Snail Sort
Given an n x n array, return the array elements arranged from outermost elements to the middle element,
traveling clockwise.
array = [[1,2,3],
         [4,5,6],
         [7,8,9]]
snail(array) #=> [1,2,3,6,9,8,7,4,5]
*/

function snail(a: number[][]): number[] {
    const result: number[] = [];
    while (a.length > 0) {
      result.push(...a.shift()!);
      a.forEach((el: number[]) => result.push(el.pop()!));
      result.push(...(a.pop() || []).reverse());
      for (let i = a.length - 1; i >= 0; i--) {
        result.push(a[i].shift()!);
      }
    }
    return result;
}
