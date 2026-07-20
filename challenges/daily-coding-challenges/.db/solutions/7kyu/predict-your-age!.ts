// My grandfather always predicted how old people would get, and right before he passed away
// he revealed his secret!
// In honor of my grandfather's memory we will write a function using his formula!
// Take a list of ages when each of your great-grandparent died.
// Multiply each number by itself.
// Add them all together.
// Take the square root of the result.
// Divide by two.

function predictAge(
  age1: number,
  age2: number,
  age3: number,
  age4: number,
  age5: number,
  age6: number,
  age7: number,
  age8: number
): number {
  return Math.floor(
    Math.sqrt(
      [age1, age2, age3, age4, age5, age6, age7, age8]
        .map((el) => el ** 2)
        .reduce((a, b) => a + b)
    ) / 2
  );
}
