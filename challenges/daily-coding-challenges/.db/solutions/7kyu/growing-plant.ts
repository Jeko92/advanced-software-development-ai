/*
Each day a plant is growing by upSpeed meters. Each night that plant's height decreases by downSpeed meters due to the
lack of sun heat. Initially, plant is 0 meters tall. We plant the seed at the beginning of a day. We want to know when
the height of the plant will reach a certain level.
Example
For upSpeed = 100, downSpeed = 10 and desiredHeight = 910, the output should be 10.
For upSpeed = 10, downSpeed = 9 and desiredHeight = 4, the output should be 1.
*/

function growingPlant(upSpeed: number, downSpeed: number, desiredHeight: number): number {
  let dayCount: number = 0;
  let currentHeight: number = 0;
  while (true) {
    dayCount++;
    currentHeight += upSpeed;
    if (currentHeight >= desiredHeight) { return dayCount; }
    currentHeight -= downSpeed;
  }
}
