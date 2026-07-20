import { styleText } from "node:util";

export function test<T>(got: T, expected: T): void {
  if (JSON.stringify(got) === JSON.stringify(expected)) {
    console.log(styleText("green", "Test succeeded"));
  } else {
    console.log(
      styleText(
        "red",
        `Test failed: got ${JSON.stringify(got)} but expected ${JSON.stringify(expected)}`,
      ),
    );
  }
}
