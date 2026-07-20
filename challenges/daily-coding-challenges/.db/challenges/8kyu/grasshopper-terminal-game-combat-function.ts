// Create a combat function that takes the player's current health and the amount of damage recieved,
// and returns the player's new health. Health can't be less than 0.

import { test } from "@/test.ts";

function combat(health: number, damage: number): number {
  // your code here
}

test(combat(100, 30), 70);
test(combat(100, 100), 0);
test(combat(50, 70), 0);
test(combat(0, 10), 0);
test(combat(30, 10), 20);
