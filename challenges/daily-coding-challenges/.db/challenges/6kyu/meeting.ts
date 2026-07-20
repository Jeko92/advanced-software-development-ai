/*
John has invited some friends. His list is:
"Fred:Corwill;Wilfred:Corwill;Barney:Tornbull;Betty:Tornbull;Bjon:Tornbull;Raphael:Corwill;Alfred:Corwill";
Could you make a program that makes this string uppercase gives it sorted in alphabetical order by last name.
When the last names are the same, sort them by first name. Last name and first name of a guest come in the result between
parentheses separated by a comma.
So the result of function meeting(s) will be:
"(CORWILL, ALFRED)(CORWILL, FRED)(CORWILL, RAPHAEL)(CORWILL, WILFRED)(TORNBULL, BARNEY)(TORNBULL, BETTY)(TORNBULL, BJON)"
*/

import { test } from "@/test.ts";

function meeting(s: string): string {
  // your code here
}

test(
  meeting("Fred:Corwill;Wilfred:Corwill;Barney:Tornbull;Betty:Tornbull;Bjon:Tornbull;Raphael:Corwill;Alfred:Corwill"),
  "(CORWILL, ALFRED)(CORWILL, FRED)(CORWILL, RAPHAEL)(CORWILL, WILFRED)(TORNBULL, BARNEY)(TORNBULL, BETTY)(TORNBULL, BJON)"
);
test(meeting("Anna:Smith;Bob:Jones"), "(JONES, BOB)(SMITH, ANNA)");
test(meeting("Alice:Brown"), "(BROWN, ALICE)");
test(meeting("Tom:Adams;Sam:Adams"), "(ADAMS, SAM)(ADAMS, TOM)");
test(meeting("Zara:Yates;Amy:Yates;Bob:Yates"), "(YATES, AMY)(YATES, BOB)(YATES, ZARA)");
