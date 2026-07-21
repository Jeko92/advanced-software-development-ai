const fruits :(string | number)[] = ['apple', 'banana', 'cherry', 123];

function shoutAll(items: (string | number)[]) : string[] {
    return items.map(item =>
        typeof item === 'string' ? item.toUpperCase() : item.toString().toUpperCase()
    );
}

function sum(numbers: number[]) :number {
    return numbers.reduce((total, n) => total + n, 0);
}

console.log(shoutAll(fruits));
console.log(sum([10, 20, 30]));