/*
Each day a plant is growing by upSpeed meters. Each night that plant's height decreases by downSpeed meters due to the
lack of sun heat. Initially, plant is 0 meters tall. We plant the seed at the beginning of a day. We want to know when
the height of the plant will reach a certain level.
Example
For upSpeed = 100, downSpeed = 10 and desiredHeight = 910, the output should be 10.
For upSpeed = 10, downSpeed = 9 and desiredHeight = 4, the output should be 1.
*/

import { test } from "@/test.ts";

function growingPlant(upSpeed: number, downSpeed: number, desiredHeight: number): number {
  // your code here
}

test(growingPlant(100, 10, 910), 10);
test(growingPlant(10, 9, 4), 1);
test(growingPlant(5, 2, 10), 3);
test(growingPlant(1, 1, 5), 5);
test(growingPlant(3, 1, 20), 10);
