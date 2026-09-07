import { colors, type Color } from './data.ts';

export function getAllColors(): Color[] {
  return colors;
}

export function getColorById(id: number): Color | null {
  return colors.find((color) => color.id === id) || null;
}

export function getRandomColor(): Color {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex]!;
}
