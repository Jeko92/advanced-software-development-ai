// Warn the sheep in front of the wolf that it is about to be eaten. Remember that you are standing at the front
// of the queue which is at the end of the array:
// [sheep, sheep, sheep, sheep, sheep, wolf, sheep, sheep]      (YOU ARE HERE AT THE FRONT OF THE QUEUE)
//    7      6      5      4      3            2      1
// If the wolf is the closest animal to you, return "Pls go away and stop eating my sheep".
// Otherwise, return "Oi! Sheep number N! You are about to be eaten by a wolf!" where N is the sheep's position in the queue.
// Note: there will always be exactly one wolf in the array.

function warnTheSheep(a: string[]): string {
    return a.indexOf('wolf') === a.length - 1
        ? "Pls go away and stop eating my sheep"
        : `Oi! Sheep number ${a.length - 1 - a.indexOf('wolf')}! You are about to be eaten by a wolf!`;
}
