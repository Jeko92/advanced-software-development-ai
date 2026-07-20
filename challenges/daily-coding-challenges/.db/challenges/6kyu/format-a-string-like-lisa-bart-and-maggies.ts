/*
https://www.codewars.com/kata/format-a-string-of-names-like-bart-lisa-and-maggie/train/javascript
Given: an array containing hashes of names

Return: a string formatted as a list of names separated by commas except for the last two names, which should be separated by an ampersand.

Example:

list([ {name: 'Bart'}, {name: 'Lisa'}, {name: 'Maggie'} ])
// returns 'Bart, Lisa & Maggie'

list([ {name: 'Bart'}, {name: 'Lisa'} ])
// returns 'Bart & Lisa'

list([ {name: 'Bart'} ])
// returns 'Bart'

list([])
// returns ''
*/

import { test } from "@/test.ts";

function list(ar: { name: string }[]): string {
  // your code here
}

test(list([{ name: "Bart" }, { name: "Lisa" }, { name: "Maggie" }]), "Bart, Lisa & Maggie");
test(list([{ name: "Bart" }, { name: "Lisa" }]), "Bart & Lisa");
test(list([{ name: "Bart" }]), "Bart");
test(list([]), "");
test(list([{ name: "Alex" }, { name: "Jacob" }, { name: "Mark" }, { name: "Max" }]), "Alex, Jacob, Mark & Max");
