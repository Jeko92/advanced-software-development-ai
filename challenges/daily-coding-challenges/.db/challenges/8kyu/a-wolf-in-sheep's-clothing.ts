// Warn the sheep in front of the wolf that it is about to be eaten. Remember that you are standing at the front
// of the queue which is at the end of the array:
// [sheep, sheep, sheep, sheep, sheep, wolf, sheep, sheep]      (YOU ARE HERE AT THE FRONT OF THE QUEUE)
//    7      6      5      4      3            2      1
// If the wolf is the closest animal to you, return "Pls go away and stop eating my sheep".
// Otherwise, return "Oi! Sheep number N! You are about to be eaten by a wolf!" where N is the sheep's position in the queue.
// Note: there will always be exactly one wolf in the array.

import { test } from "@/test.ts";

function warnTheSheep(a: string[]): string {
  // your code here
}

test(warnTheSheep(["sheep", "sheep", "sheep", "wolf", "sheep"]), "Oi! Sheep number 1! You are about to be eaten by a wolf!");
test(warnTheSheep(["sheep", "wolf"]), "Pls go away and stop eating my sheep");
test(warnTheSheep(["wolf", "sheep", "sheep"]), "Oi! Sheep number 2! You are about to be eaten by a wolf!");
test(warnTheSheep(["sheep", "sheep", "wolf"]), "Pls go away and stop eating my sheep");
test(warnTheSheep(["sheep", "wolf", "sheep", "sheep"]), "Oi! Sheep number 2! You are about to be eaten by a wolf!");
