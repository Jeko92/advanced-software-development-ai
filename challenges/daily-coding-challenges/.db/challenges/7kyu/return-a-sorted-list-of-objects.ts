// You'll be passed an array of objects (list) - you must sort them in descending order
// based on the value of the specified property (sortBy).

import { test } from "@/test.ts";

function sortList(sortBy: string, list: Record<string, number>[]): Record<string, number>[] {
  // your code here
}

test(sortList("age", [{ age: 30 }, { age: 20 }, { age: 40 }]), [{ age: 40 }, { age: 30 }, { age: 20 }]);
test(sortList("score", [{ score: 1 }, { score: 3 }, { score: 2 }]), [{ score: 3 }, { score: 2 }, { score: 1 }]);
test(sortList("val", [{ val: 5 }]), [{ val: 5 }]);
test(sortList("n", [{ n: 0 }, { n: -1 }, { n: 1 }]), [{ n: 1 }, { n: 0 }, { n: -1 }]);
test(sortList("x", [{ x: 10 }, { x: 10 }, { x: 5 }]), [{ x: 10 }, { x: 10 }, { x: 5 }]);
