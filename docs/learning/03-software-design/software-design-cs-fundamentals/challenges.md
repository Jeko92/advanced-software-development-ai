# Software Design CS Fundamentals - Challenges

## Big O reasoning

Each snippet below takes an array `arr` of length `n`. Assign a Big O complexity
class to each one and write a sentence justifying your answer.

```javascript
// snippet 1
function first(arr) {
  return arr[0];
}
```

```javascript
// snippet 2
function second(arr) {
  let total = 0;
  for (const value of arr) {
    total += value;
  }
  return total;
}
```

```javascript
// snippet 3
function third(arr) {
  for (const a of arr) {
    for (const b of arr) {
      if (a === b) console.log(a);
    }
  }
}
```

```javascript
// snippet 4
function fourth(arr) {
  for (const value of arr) {
    for (let i = 0; i < 10; i++) {
      console.log(value, i);
    }
  }
}
```

```javascript
// snippet 5
function fifth(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  return [...fifth(arr.slice(0, mid)), ...fifth(arr.slice(mid))];
}
```

## Implement insertion sort

Write an `insertionSort` function that takes an array of numbers and returns it
sorted in ascending order. Match the algorithm from the algorithms file: walk
the array from the second element onwards, and for each element, slide it left
past every larger value until it lands in the right place.

```javascript
function insertionSort(arr) {
  // your code here
}

console.log(insertionSort([5, 2, 4, 6, 1, 3]));
// → [1, 2, 3, 4, 5, 6]
```

A few things to decide while implementing:

- whether to mutate the input array or work on a copy
- how the inner loop knows when to stop sliding the current value
- what happens for an empty array or an array of length one

Once it works, test it on three inputs and count how many comparisons it makes
for each:

- an already-sorted array, e.g. `[1, 2, 3, 4, 5]`
- a reverse-sorted array, e.g. `[5, 4, 3, 2, 1]`
- a single-element array `[42]`

The already-sorted and single-element cases should be cheap. The reverse-sorted
case should be expensive. That gap is what the algorithms file means when it
says insertion sort is `O(n²)` worst case but `O(n)` best case.

## Undo / Redo

Build a small UI with one text input and two buttons, Undo and Redo, that uses
two stacks to track edit history. Use vanilla TypeScript and HTML.

The state to track is the current value of the input plus two stacks:

- a `back` stack, holding earlier values of the input
- a `forward` stack, holding values that have been undone

The behavior on each action:

- on every change to the input, push the previous value onto `back`, update the
  current value to the new one, and empty `forward`
- on Undo (when `back` is non-empty), push the current value onto `forward`, pop
  the top of `back`, and set it as the current value
- on Redo (when `forward` is non-empty), push the current value onto `back`, pop
  the top of `forward`, and set it as the current value
- disable the Undo button when `back` is empty, and the Redo button when
  `forward` is empty
