// Scenario
// Several people are standing in a row divided into two teams.
// The first person goes into team 1, the second goes into team 2, the third goes into team 1,
// and so on.
// Task
// Given an array of positive integers (the weights of the people), return a new array/tuple
// of two integers, where the first one is the total weight of team 1, and the second one is
// the total weight of team 2.

function rowWeights(arr: number[]): [number, number] {
  let team1: number = 0;
  let team2: number = 0;
  for (let i = 0; i < arr.length; i++) {
    i % 2 === 0 || i === 0 ? (team1 += arr[i]) : (team2 += arr[i]);
  }
  return [team1, team2];
}
