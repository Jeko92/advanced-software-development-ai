// Our football team finished the championship. The result of each match look like "x:y". Results of all matches are recorded
// in the collection.
// For example: ["3:1", "2:2", "0:1", ...]
// Write a function that takes such collection and counts the points of our team in the championship. Rules for counting points
// for each match:
// if x>y - 3 points
// if x<y - 0 point
// if x=y - 1 point

function points(a: string[]): number {
    return a.reduce((x, y) => x + (y[0] > y[2] ? 3 : y[0] < y[2] ? 0 : 1), 0);
}
