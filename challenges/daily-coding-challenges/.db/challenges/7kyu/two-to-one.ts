import { test } from "@/test.ts";

function longest(s1: string, s2: string): string {
  // your code here
}

test(longest("aretheyhere", "yestheyarehere"), "aehrsty");
test(longest("loopingisfun", "theloopingisfunzone"), "acefghilnoprstu");
test(longest("a", "b"), "ab");
test(longest("abc", "abc"), "abc");
test(longest("xyz", "abc"), "abcxyz");
