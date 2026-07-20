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

import { test } from "@/test.ts";

interface Addable {
    (y: number): Addable;
    valueOf(): number;
}

function add(n: number): Addable {
    // your code here
}

test(add(1)(2).valueOf(), 3);
test(add(1)(2)(3).valueOf(), 6);
test(add(1)(2)(3)(4).valueOf(), 10);
test(add(1)(2)(3)(4)(5).valueOf(), 15);
test(add(10)(20)(30).valueOf(), 60);
