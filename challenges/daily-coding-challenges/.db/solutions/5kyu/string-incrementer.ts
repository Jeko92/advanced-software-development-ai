// Your job is to write a function which increments a string, to create a new string.
// If the string already ends with a number, the number should be incremented by 1.
// If the string does not end with a number. the number 1 should be appended to the new string.
// Examples:
// foo -> foo1
// foobar23 -> foobar24
// foo0042 -> foo0043
// foo099 -> foo100
// Attention: If the number has leading zeros the amount of digits should be considered.

function incrementString(s: string): string {
    const num: RegExpMatchArray | null = s.match(/\d+$/);
    if (!num) return s.concat('1');
    if (num[0].split('').every((x: string) => x === '0')) {
        return s.slice(0, s.length - 1).concat('1');
    }
    return `${s.slice(0, s.length - num[0].length).concat((Number(num[0]) + 1).toString().padStart(num[0].length, '0'))}`;
}
