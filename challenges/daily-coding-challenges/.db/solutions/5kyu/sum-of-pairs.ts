/*
Given a list of integers and a single sum value, return the first two values (parse from the left please) in order
of appearance that add up to form the sum.
Negative numbers and duplicate numbers can and will appear.
*/

function sum_pairs(list: number[], s: number): [number, number] | undefined {
    let last: number | undefined;
    for (let i = 0; i < list.length; i++) {
        if (last !== undefined && last === list[i]) continue;
        last = list[i];
        const sl: number[] = list.slice(0, i);
        const sumIndex: number = sl.indexOf(s - list[i]);
        if (sumIndex !== -1) return [sl[sumIndex], list[i]];
    }
}
