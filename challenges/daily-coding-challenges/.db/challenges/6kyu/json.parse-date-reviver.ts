/*
https://www.codewars.com/kata/533b0d5e7abec41550000a9e
JSON.stringify is very useful for serializing javascript objects and values into a string. JSON.parse is very useful for
deserializing these strings back into the original objects. Unfortunately, the JSON format has no way of representing a
Date object. Instead, it creates a string for that object, and includes that in the serialized string instead. The problem
is, when JSON.parse deserializes the JSON string, it sees it as a simple string, and does not convert it into a real Date object.
Let's fix that with a JSON_Date_reviver function for use with JSON.parse. JSON.parse allows for a second, optional parameter;
a function that can take two arguments, known as the "reviver". The first is the "key" of the property in an object; the second
is the "value" of that property. If the parser is not going over an object's property, the "key" is empty, and the value is whatever
value it is currently trying to parse. Whatever value is returned by the function will be used as the value slotted into the parsed
object at the end.
Your job is to write the JSON_Date_reviver() function to return a real Date object when the value passed in is one of those date
strings. If it is not a "date string", however, the original value should be returned as-is.
*/

import { test } from "@/test.ts";

function JSON_Date_reviver(key: string, value: any): Date | any {
  // your code here
}

test(JSON_Date_reviver("", "2014-01-01T23:28:56.782Z") instanceof Date, true);
test(JSON_Date_reviver("", "hello"), "hello");
test(JSON_Date_reviver("", 42), 42);
test(JSON_Date_reviver("date", "2023-06-15T10:00:00.000Z") instanceof Date, true);
test(JSON_Date_reviver("", null), null);
