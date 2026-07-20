/*
https://www.codewars.com/kata/take-a-picture/train/javascript
Given a gallery of photos, write a function to sort through your pictures. You get a random hard disk drive full
of pics, you must return an array with the 5 most recent ones PLUS the next one (same year and number following
the one of the last).
You will always get at least a photo and all pics will be in the format YYYY.imgN
Examples:
sortPhotos["2016.img1","2016.img2","2015.img3","2016.img4","2013.img5"])
==["2013.img5","2015.img3","2016.img1","2016.img2","2016.img4","2016.img5"]
sortPhotos["2016.img1"]) ==["2016.img1","2016.img2"]
*/

function sortPhotos(a: string[]): string[] {
    const sorted: string[] = a.sort((a: string, b: string) => {
        return Number(b.slice(0, b.indexOf('.'))) === Number(a.slice(0, a.indexOf('.'))) ?
            Number(a.slice(a.indexOf('g') + 1)) - Number(b.slice(b.indexOf('g') + 1)) :
            Number(a.slice(0, a.indexOf('.'))) - Number(b.slice(0, b.indexOf('.')));
    });
    const lastFive: string[] = sorted.slice(sorted.length - 5);
    const lastElement: string = sorted[sorted.length - 1];
    const lastNumber: number = Number(lastElement.slice(lastElement.indexOf('g') + 1));
    const nextElement: string = `${lastElement.slice(0, lastElement.indexOf('g') + 1)}${lastNumber + 1}`;
    return [...lastFive, nextElement];
}
