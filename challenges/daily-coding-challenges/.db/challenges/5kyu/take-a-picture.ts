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

import { test } from "@/test.ts";

function sortPhotos(a: string[]): string[] {
    // your code here
}

test(sortPhotos(["2016.img1", "2016.img2", "2015.img3", "2016.img4", "2013.img5"]), ["2013.img5", "2015.img3", "2016.img1", "2016.img2", "2016.img4", "2016.img5"]);
test(sortPhotos(["2016.img1"]), ["2016.img1", "2016.img2"]);
test(sortPhotos(["2020.img3", "2019.img1", "2021.img2", "2018.img4", "2020.img5"]), ["2019.img1", "2020.img3", "2020.img5", "2021.img2", "2021.img3"]);
test(sortPhotos(["2010.img10", "2010.img20", "2010.img30", "2010.img40", "2010.img50", "2010.img60"]), ["2010.img20", "2010.img30", "2010.img40", "2010.img50", "2010.img60", "2010.img61"]);
test(sortPhotos(["2000.img1", "2001.img2"]), ["2000.img1", "2001.img2", "2001.img3"]);
