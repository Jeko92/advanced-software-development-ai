/*
We want to create a function that will add numbers together when called in succession.
add(1)(2);
// returns 3
We also want to be able to continue to add numbers to our chain.
add(1)(2)(3); // 6
add(1)(2)(3)(4); // 10
add(1)(2)(3)(4)(5); // 15
and so on.
*/

interface Addable {
    (y: number): Addable;
    valueOf(): number;
}

function add(n: number): Addable {
    const sum = (y: number): Addable => add(n + y);
    sum.valueOf = (): number => n;
    return sum as Addable;
}
