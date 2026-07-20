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

interface CapitalEntry {
  state?: string;
  country?: string;
  capital: string;
}

function capital(a: CapitalEntry[]): string[] {
  return a.map((el: CapitalEntry) => {
    const entity: 'state' | 'country' = 'state' in el ? 'state' : 'country';
    return `The capital of ${el[entity]} is ${el.capital}`;
  });
}
