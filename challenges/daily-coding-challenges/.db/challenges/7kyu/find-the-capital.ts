/*
Write a method that takes a sequence of objects with two keys each: country or state, and capital.
Keys may be symbols or strings
The method should return an array of sentences declaring the state or country and its capital.

Examples:

state_capitals = [{state: 'Maine', capital: 'Augusta'}]
capital(state_capitals)[0] // returns "The capital of Maine is Augusta"

country_capitals = [{'country' : 'Spain', 'capital' : 'Madrid'}]
capital(country_capitals)[0]  // returns "The capital of Spain is Madrid"

mixed_capitals: [{"state" : 'Maine', capital: 'Augusta'}, {country: 'Spain', "capital" : "Madrid"}]
capital(mixed_capitals)[1] // returns "The capital of Spain is Madrid"
*/

import { test } from "@/test.ts";

interface CapitalEntry {
  state?: string;
  country?: string;
  capital: string;
}

function capital(a: CapitalEntry[]): string[] {
  // your code here
}

test(capital([{ state: 'Maine', capital: 'Augusta' }]), ["The capital of Maine is Augusta"]);
test(capital([{ country: 'Spain', capital: 'Madrid' }]), ["The capital of Spain is Madrid"]);
test(capital([{ state: 'Maine', capital: 'Augusta' }, { country: 'Spain', capital: 'Madrid' }]), ["The capital of Maine is Augusta", "The capital of Spain is Madrid"]);
test(capital([{ country: 'France', capital: 'Paris' }]), ["The capital of France is Paris"]);
test(capital([{ state: 'Texas', capital: 'Austin' }, { state: 'Florida', capital: 'Tallahassee' }]), ["The capital of Texas is Austin", "The capital of Florida is Tallahassee"]);
