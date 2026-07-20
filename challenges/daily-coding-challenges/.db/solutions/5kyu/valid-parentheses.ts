/*
https://www.codewars.com/kata/52774a314c2333f0a7000688/train/javascript
Write a function called that takes a string of parentheses, and determines if the order
of the parentheses is valid. The function should return true if the string is valid, and false
if it's invalid.
Examples
"()"              =>  true
")(()))"          =>  false
"("               =>  false
"(())((()())())"  =>  true
*/

function validParenthesis(p: string): boolean {
    while (p.includes('()')) {
        p = p.split('()').join('');
    }
    return p.length === 0;
}
