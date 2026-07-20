// Consider an array of sheep where some sheep may be missing from their place.
// We need a function that counts the number of sheep present in the array (true means present).

function countSheeps(a: (boolean | undefined | null)[]): number {
    return a.filter(el => el).length;
}
