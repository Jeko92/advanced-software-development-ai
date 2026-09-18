export { cn } from 'cn';

export function sleep() {
  return new Promise((resolve) => setTimeout(resolve, randomRange(400, 1200)));
}

export function randomRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
