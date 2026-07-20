/*
Every now and then people in the office moves teams or departments.
Depending what people are doing with their time they can become more or less boring.
Time to assess the current team.
You will be provided with an object(staff) containing the staff names as keys, and the
department they work in as values.
Each department has a different boredom assessment score, as follows:

accounts = 1
finance = 2
canteen = 10
regulation = 3
trading = 6
change = 6
IS = 8
retail = 5
cleaning = 4
pissing about = 25

Depending on the cumulative score of the team, return the appropriate sentiment:
<=80: 'kill me now'
< 100 & > 80: 'i can handle this'
100 or over: 'party time!!'
*/

import { test } from "@/test.ts";

function boredom(s: Record<string, string>): string {
  // your code here
}

test(boredom({ Amy: "accounts", Bob: "finance", Charlie: "canteen" }), "kill me now");
test(boredom({ A: "pissing about", B: "pissing about", C: "pissing about", D: "pissing about", E: "canteen" }), "party time!!");
test(boredom({ X: "IS", Y: "IS", Z: "IS", W: "IS", V: "IS", U: "IS", T: "IS", S: "IS", R: "IS", Q: "IS", P: "IS", O: "IS" }), "party time!!");
test(boredom({ X: "trading", Y: "IS" }), "kill me now");
test(boredom({ A: "pissing about", B: "IS", C: "trading", D: "canteen", E: "retail", F: "cleaning", G: "regulation" }), "i can handle this");
