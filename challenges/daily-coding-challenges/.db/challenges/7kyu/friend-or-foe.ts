/*
Make a program that filters a list of strings and returns a list with only your friends name in it.
If a name has exactly 4 letters in it, you can be sure that it has to be a friend of yours!
Otherwise, you can be sure he's not...
Ex: Input = ["Ryan", "Kieran", "Jason", "Yous"], Output = ["Ryan", "Yous"]
Note: keep the original order of the names in the output.
*/

import { test } from "@/test.ts";

function friend(friends: string[]): string[] {
  // your code here
}

test(friend(["Ryan", "Kieran", "Jason", "Yous"]), ["Ryan", "Yous"]);
test(friend(["Jimm", "Cari", "aret", "truehdnviegkwgvke", "sixtyOneDriver"]), ["Jimm", "Cari", "aret"]);
test(friend([]), []);
test(friend(["Mark", "Jim"]), ["Mark"]);
test(friend(["Anna", "Kate", "Lena"]), ["Anna", "Kate", "Lena"]);
