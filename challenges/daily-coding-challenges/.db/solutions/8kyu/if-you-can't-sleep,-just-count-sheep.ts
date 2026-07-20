// Given a non-negative integer, 3 for example, return a string with a murmur:
// "1 sheep...2 sheep...3 sheep...". Input will always be valid, i.e. no negative integers.

function countSheep(n: number): string {
    let s: string = '';
    for (let i = 1; i < n + 1; i++) {
        s += `${i} sheep...`;
    }
    return s;
}
