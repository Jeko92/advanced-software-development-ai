```js
// --- + is ambiguous: string concat OR numeric addition ---
5 + "5"        // "55"   -> number gets coerced to string, then concatenated
"5" + 5        // "55"   -> same, order doesn't matter for +
5 + 5          // 10     -> both numbers, normal addition
"5" + "5"      // "55"   -> both strings, normal concatenation

// --- but -, *, / always force numeric coercion, no ambiguity ---
5 - "5"        // 0      -> "5" is coerced to number 5
"10" - "5"     // 5      -> both strings coerced to numbers
"5" * "2"      // 10     -> coerced to numbers
"10" / "2"     // 5      -> coerced to numbers

// --- Order matters once strings enter the mix ---
"5" + 5 - 2        // 53   -> "5"+5 = "55" (string), then "55"-2 = 53 (coerced back to number!)
1 + "1" + 1        // "111" -> 1+"1" = "11" (string), then "11"+1 = "111"
1 + 1 + "1"        // "21"  -> 1+1 = 2 (number), then 2+"1" = "21"
// Same numbers, same operators, different ORDER = wildly different results

// --- Arrays and objects get coerced to strings/numbers in weird ways ---
[] + []            // ""              -> both arrays become "" then concatenate
[] + {}            // "[object Object]" -> [] becomes "", {} becomes "[object Object]"
{} + []            // 2 (in Node) or "[object Object]" in a browser console!
//   -> context-dependent: {} can be parsed as an empty BLOCK statement, not an object literal

// --- Booleans coerce to 1 / 0 ---
true + true        // 2       -> true becomes 1, so 1+1
"5" - true         // 4       -> true becomes 1, so 5-1
"5" + true         // "5true" -> + triggers string concat, so true becomes the STRING "true", not 1

// --- null vs undefined coerce differently ---
null + 1            // 1    -> null becomes 0
undefined + 1        // NaN  -> undefined becomes NaN, and NaN poisons anything it touches

// --- chained non-numeric subtraction still forces numbers ---
"10" - "4" - "3" - 2 + "5"   // "15"  -> "10"-"4"-"3"-2 = 1 (all coerced to numbers)
//           then 1 + "5" = "15" (back to string because of +)

// --- comparison chaining doesn't work like math class ---
1 < 2 < 3           // true   -> (1<2) is true(→1), then 1<3 is true
3 > 2 > 1           // false  -> (3>2) is true(→1), then 1>1 is false  <-- gotcha!

// --- NaN breaks equality entirely ---
NaN === NaN         // false  -> NaN is never equal to anything, even itself

// --- subtracting from a non-numeric string ---
"abc" - 1           // NaN    -> "abc" can't become a number at all

// --- + on arrays of numbers stringifies them, doesn't sum ---
  [1,2,3] + [4,5,6]   // "1,2,34,5,6"  -> arrays become "1,2,3" and "4,5,6" strings, then concatenated

// --- unary + is a quick "convert to number" trick, but has its own edge cases ---
+"5"                // 5
+""                 // 0        -> empty string becomes 0!
+"  42  "           // 42       -> whitespace is trimmed
+[]                  // 0        -> empty array -> "" -> 0
+[5]                 // 5        -> single-item array -> "5" -> 5
+[5,6]               // NaN      -> "5,6" can't become a number
```
