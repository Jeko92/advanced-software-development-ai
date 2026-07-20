/*
https://www.codewars.com/kata/52840d2b27e9c932ff0016ae/train/javascript
Write a function that gets a sequence and value and returns true/false depending
on whether the variable exists in a multidimentional sequence.

Example:

locate(['a','b',['c','d',['e']]],'e'); // should return true
locate(['a','b',['c','d',['e']]],'a'); // should return true
locate(['a','b',['c','d',['e']]],'f'); // should return false
*/

type NestedArray = (unknown | NestedArray)[];

function locate(array: NestedArray, value: unknown): boolean {
    const flattenDeep = (array: NestedArray): unknown[] => {
        return array.reduce<unknown[]>((acc: unknown[], val: unknown) =>
            Array.isArray(val) ? acc.concat(flattenDeep(val as NestedArray)) : acc.concat(val), []);
    };
    return flattenDeep(array).includes(value);
}
