/*
https://www.codewars.com/kata/the-lamp-revisited/train/javascript
Define a class called Lamp. It will have a string attribute for color and boolean attribute, on, that will
refer to whether the lamp is on or not. Define your class constructor with a parameter for color and assign
on as false on initialize.
Give the lamp an instance method called toggleSwitch that will switch the value of the on attribute.
Define another instance method called state that will return "The lamp is on." if it's on and "The lamp is off."
otherwise.
*/

import { test } from "@/test.ts";

class Lamp {
  color: string;
  on: boolean;

  constructor(color: string) {
    // your code here
  }

  toggleSwitch(): void {
    // your code here
  }

  state(): string {
    // your code here
  }
}

const lamp = new Lamp("red");
test(lamp.state(), "The lamp is off.");
lamp.toggleSwitch();
test(lamp.state(), "The lamp is on.");
lamp.toggleSwitch();
test(lamp.state(), "The lamp is off.");
test(lamp.color, "red");
test(lamp.on, false);
