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

function list(ar: { name: string }[]): string {
  let list: string = '';
  if (ar.length == 0) {
    return list;
  }
  if (ar.length == 1) {
    return ar[0].name;
  }
  if (ar.length == 2) {
    return `${ar[0].name} & ${ar[1].name}`;
  }
  for (let i = 0; i < ar.length - 1; i++) {
    list += ', ' + ar[i].name;
  }
  return list.slice(2) + ' & ' + ar[ar.length - 1].name;
}
