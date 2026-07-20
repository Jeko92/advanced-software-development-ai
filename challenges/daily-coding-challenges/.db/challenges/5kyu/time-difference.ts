import { test } from "@/test.ts";

function solve(arr: string[]): string {
    // your code here
}

test(solve(["00:00", "23:00"]), "23:0");
test(solve(["01:30", "03:45"]), "2:15");
test(solve(["08:00", "08:00"]), "0:0");
test(solve(["06:15", "12:00", "23:59"]), "17:44");
test(solve(["00:01", "12:30"]), "12:29");
