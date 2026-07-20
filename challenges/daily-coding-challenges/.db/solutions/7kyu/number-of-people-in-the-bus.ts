// There is a bus moving in the city, and it takes and drop some people in each bus stop.
// You are provided with a list (or array) of integer arrays (or tuples).
// Each integer array has two items which represent number of people get into bus (The first item)
// and number of people get off the bus (The second item) in a bus stop.
// Your task is to return number of people who are still in the bus after the last bus station
// (after the last array). Even though it is the last bus stop, the bus is not empty and some people
// are still in the bus, and they are probably sleeping there :D

function number(b: [number, number][]): number {
  let people: number = 0;
  b.forEach((el) => {
    people = people + el[0] - el[1];
  });
  return people;
}
