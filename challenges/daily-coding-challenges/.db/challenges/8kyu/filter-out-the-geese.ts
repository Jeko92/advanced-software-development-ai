import { test } from "@/test.ts";

function gooseFilter(birds: string[]): string[] {
  // your code here
}

test(gooseFilter(["Mallard", "Hook Bill", "African", "Crested", "Pilgrim", "Toulouse", "Blue Swedish"]), ["Mallard", "Hook Bill", "Crested", "Blue Swedish"]);
test(gooseFilter(["African", "Roman Tufted", "Toulouse", "Pilgrim", "Steinbacher"]), []);
test(gooseFilter(["Mallard", "Hook Bill"]), ["Mallard", "Hook Bill"]);
test(gooseFilter([]), []);
test(gooseFilter(["African", "Duck"]), ["Duck"]);
