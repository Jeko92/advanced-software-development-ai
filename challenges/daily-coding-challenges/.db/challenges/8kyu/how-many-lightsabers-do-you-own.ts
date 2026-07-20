import { test } from "@/test.ts";

function howManyLightsabersDoYouOwn(name: string): number {
  // your code here
}

test(howManyLightsabersDoYouOwn("Zach"), 18);
test(howManyLightsabersDoYouOwn("Luke"), 0);
test(howManyLightsabersDoYouOwn(""), 0);
test(howManyLightsabersDoYouOwn("zach"), 0);
test(howManyLightsabersDoYouOwn("Obi-Wan"), 0);
