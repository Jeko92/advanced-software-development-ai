/*
The objective of Duck, duck, goose is to walk in a circle, tapping on each player's head until one is chosen.
Task: Given an array of Player objects and an index (1-based), return the name of the chosen Player(name is a
property of Player objects, e.g Player.name)
Example:
duck_duck_goose([a, b, c, d], 1) should return a.name
duck_duck_goose([a, b, c, d], 5) should return a.name
*/

interface Player {
    name: string;
}

function duckDuckGoose(p: Player[], g: number): string {
    return p[(g - 1) % p.length].name;
}
