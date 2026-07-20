import { formatId } from "./types.ts";
import type { Track, FeaturedTrack } from "./types.ts";

const libraryName = "Late Night Listening";

function describeTrack(track: Track): string {
  return `${track.title} by ${track.artist}`;
}

const tracks: Track[] = [
  { id: 1, title: "Blue Light", artist: "Jorja Smith", liked: true },
  { id: 2, title: "Nights", artist: "Frank Ocean", liked: false },
];

const pick: FeaturedTrack = {
  id: 3,
  title: "Golden",
  artist: "Jill Scott",
  liked: true,
  curatedBy: "editorial",
  addedDate: "2024-01-15",
};

console.log(`Library: ${libraryName}`);

const firstTrack = tracks[0];

if (firstTrack) {
  console.log(describeTrack(firstTrack));
}

tracks.forEach((t) => console.log(formatId(t.id)));
console.log(`Featured: ${pick.title} — added ${pick.addedDate}`);
