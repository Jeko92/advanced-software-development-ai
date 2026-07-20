// In this Kata, you'll write a function that extracts pieces of data and stores them in an Array.
// The function will accept two parameters:
// data: An Array of Objects
// property: A String representing the property from which to pluck data
// An Array should be returned, containing the value extracted for each Object contained in the data Array.

function pluck(data: Record<string, unknown>[], property: string): unknown[] {
  return data.map((v) => v[property]);
}
