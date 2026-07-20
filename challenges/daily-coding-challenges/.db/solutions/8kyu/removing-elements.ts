// Take an array and remove every second element out of that array. Always keep the first element and
// start removing with the next element.

function removeEveryOther(ar: unknown[]): unknown[] {
    return ar.filter((el, index) => index % 2 === 0);
}
